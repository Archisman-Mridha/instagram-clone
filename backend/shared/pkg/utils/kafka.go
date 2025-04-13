package utils

const (
	DBOperationCreate = "c"
	DBOperationRead   = "r"
	DBOperationUpdate = "u"
	DBOperationDelete = "d"

	// Kafka topics.

	KafkaTopicUsersCreated = "users.created"

	KafkaTopicProfilesCreated = "profiles.created"

	KafkaTopicFollowshipsCreated = "followships.created"
	KafkaTopicFollowshipsDeleted = "followships.deleted"

	KafkaTopicPostsCreated = "posts.created"
)
