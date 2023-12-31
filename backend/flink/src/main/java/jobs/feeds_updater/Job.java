package jobs.feeds_updater;

import org.apache.flink.api.common.eventtime.WatermarkStrategy;
import org.apache.flink.connector.kafka.source.KafkaSource;
import org.apache.flink.connector.kafka.source.enumerator.initializer.OffsetsInitializer;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;

// A Flink Application is any user program that spawns one or multiple Flink jobs from its main( )
// method.
public class Job {

	public static void main(String[] args) throws Exception {

		// The execution of these jobs can happen in a local JVM (LocalEnvironment) or on a remote setup
		// of clusters with multiple machines (RemoteEnvironment). For each program, the
		// ExecutionEnvironment provides methods to control the job execution (e.g. setting the
		// parallelism) and to interact with the outside world.
		StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment( );

		var source=
			KafkaSource.<PostsDbEvent>builder( )
				.setBootstrapServers("kafka:9092")
				.setTopics("db-events.public.posts")
				.setGroupId("default")
				.setStartingOffsets(OffsetsInitializer.earliest( ))
				.setValueOnlyDeserializer(new PostsDbEventDeserializationSchema( ))
				.build( );

		var postsDbEventsStream= env.fromSource(source, WatermarkStrategy.noWatermarks( ), "Kafka Source");

		env.execute("FeedsUpdater Job");
	}
}