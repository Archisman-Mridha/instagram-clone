/*
  Debezium is a set of distributed services to capture changes in your databases so that your
  applications can see those changes and respond to them. Debezium records all row-level changes
  within each database table in a change event stream, and applications simply read these streams
  to see the change events in the same order in which they occurred.

  Debezium is built on top of Apache Kafka and provides a set of Kafka Connect compatible
  connectors. Each of the connectors works with a specific database management system (DBMS).
  Connectors record the history of data changes in the DBMS by detecting changes as they occur,
  and streaming a record of each change event to a Kafka topic. Consuming applications can then
  read the resulting event records from the Kafka topic.

  Most commonly, you deploy Debezium by means of Apache Kafka Connect. Kafka Connect is a
  framework and runtime for implementing and operating:

    (1) Source connectors such as Debezium that send records into Kafka

    (2) Sink connectors that propagate records from Kafka topics to other systems
*/
{}
