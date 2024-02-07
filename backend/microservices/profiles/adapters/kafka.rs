use crate::{
  domain::{ports::UserCreatedEvent, usecases::Usecases},
  CONFIG, THREAD_CANCELLATION_TOKEN,
};
use anyhow::{anyhow, Ok, Result};
use kafka::consumer::Consumer;
use shared::utils::{
  debezium::DbOperation,
  kafka::{createKafkaConsumer, extractEventFromMessage},
};
use std::time::Duration;
use tokio::{select, time::sleep};
use tracing::error;

const KAFKA_TOPIC: &'static str = "db-events.public.users";

// Whenever a user is created / updated / deleted in the users database, that database event is
// picked up by Debezium and forwarded to the 'db-events.public.users' topic in Apache Kafka. The
// role of KafkaAdapter is to consume those events and invoke the usecases layer for processing it.
pub struct KafkaAdapter {
  consumer: Consumer,
}

impl KafkaAdapter {
  pub fn new() -> Self {
    let consumer = createKafkaConsumer(
      CONFIG.KAFKA_HOSTS.split(',').map(String::from).collect(),
      KAFKA_TOPIC.to_string(),
      "default".to_string(),
    );

    Self { consumer }
  }

  pub async fn consume(&mut self, usecases: &Usecases) {
    loop {
      let result = select! {
        _= THREAD_CANCELLATION_TOKEN.cancelled( ) => return,

        result= self._consume(usecases) => result
      };

      if let Err(error) = result {
        error!("{}", error)
      }

      sleep(Duration::from_secs(1)).await;
    }
  }

  async fn _consume(&mut self, usecases: &Usecases) -> Result<()> {
    let messageSets = self.consumer.poll().map_err(|error| {
      anyhow!(
        "ERROR : Consuming messages from '{}' kafka topic: {}",
        KAFKA_TOPIC,
        error
      )
    })?;

    if messageSets.is_empty() {
      return Ok(());
    }

    for messageSet in messageSets.iter() {
      let partition = messageSet.partition();

      for message in messageSet.messages() {
        let payload =
          extractEventFromMessage::<UserCreatedEvent>(message.value, KAFKA_TOPIC)?.payload;

        let consumeMessage: bool;

        match payload.op {
          DbOperation::Create => {
            consumeMessage = usecases.createProfile(payload.after.unwrap()).await.is_ok()
          }

          _ => consumeMessage = true,
        }

        if consumeMessage {
          self
            .consumer
            .consume_message(KAFKA_TOPIC, partition, message.offset)
            .map_err(|error| anyhow!("ERROR : Trying to consume Kafka message : {}", error))?;
        }
      }
    }

    self.consumer.commit_consumed().map_err(|error| {
      anyhow!(
        "ERROR : Trying to commit consumed Kafka messages : {}",
        error
      )
    })
  }
}
