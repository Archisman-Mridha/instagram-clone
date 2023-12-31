/*
	APACHE FLINK ARCHITECTURE -
	(Image - https://nightlies.apache.org/flink/flink-docs-release-1.18/fig/processes.svg)

	The Flink runtime consists of two types of processes: a JobManager and one or more TaskManagers.

	The Client is not part of the runtime and program execution, but is used to prepare and send a
	dataflow to the JobManager. After that, the client can disconnect (detached mode), or stay
	connected to receive progress reports (attached mode). The client runs either as part of the
	Java/Scala program that triggers the execution, or in the command line process 'flink run ...'.

	1. JobManager -

	It decides when to schedule the next task (or set of tasks), reacts to finished tasks or execution
	failures, coordinates checkpoints, and coordinates recovery on failures, among others. This
	process consists of three different components:
	|
	|- ResourceManager - responsible for resource de-/allocation and provisioning in a Flink cluster.
	|	 It manages task slots (the unit of resource scheduling) in a Flink cluster. Flink implements
	|	 multiple ResourceManagers for different environments and resource providers such as Kubernetes.
	|
	|- Dispatcher - provides a REST interface to submit Flink applications for execution and starts a
	|	 new JobMaster for each submitted job. It also runs the Flink WebUI to provide information about
	|  job executions.
	|
	|- JobMaster - responsible for managing the execution of a single JobGraph. Multiple jobs can run
	|  simultaneously in a Flink cluster, each having its own JobMaster.

	There is always at least one JobManager. A high-availability setup might have multiple JobManagers,
	one of which is always the leader, and the others are standby.

	2. TaskManagers (workers) -

	They execute the tasks of a dataflow, and buffer and exchange the data streams. There must always
	be at least one TaskManager. The smallest unit of resource scheduling in a TaskManager is a task
	slot. The number of task slots in a TaskManager indicates the number of concurrent processing tasks.
*/