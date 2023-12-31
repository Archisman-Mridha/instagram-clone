package jobs.feeds_updater;

import java.io.IOException;
import org.apache.flink.api.common.serialization.DeserializationSchema;
import org.apache.flink.api.common.typeinfo.TypeInformation;
import org.apache.flink.shaded.jackson2.com.fasterxml.jackson.databind.ObjectMapper;

/*
	Deserialization schema -

	The deserialization schema describes how to turn the byte messages delivered by certain data
	sources (for example Apache Kafka) into data types (Java/Scala objects). In addition, the
	DeserializationSchema describes the produced type (getProducedType( )), which lets Flink create
	internal serializers and structures to handle the type.
*/

public class PostsDbEventDeserializationSchema implements DeserializationSchema<PostsDbEvent> {

	// ObjectMapper is used for converting between Java objects and JSON representations.
	static ObjectMapper objectMapper = new ObjectMapper( );

	// Deserializes the byte message.
	@Override
	public PostsDbEvent deserialize(byte[] message) throws IOException {
		return objectMapper.readValue(message, PostsDbEvent.class);
	}

	// Method to decide whether the element signals the end of the stream. If true is returned the
	// element won't be emitted.
	@Override
	public boolean isEndOfStream(PostsDbEvent nextElement) {
		return false;
	}

	// Gets the data type (as a TypeInformation) produced by this function or input format.
	@Override
	public TypeInformation<PostsDbEvent> getProducedType( ) {
		return TypeInformation.of(PostsDbEvent.class);
	}
}