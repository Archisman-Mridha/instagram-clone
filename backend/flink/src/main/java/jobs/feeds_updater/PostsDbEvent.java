package jobs.feeds_updater;

import java.io.IOException;
import org.apache.flink.shaded.jackson2.com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.apache.flink.shaded.jackson2.com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.flink.shaded.jackson2.com.fasterxml.jackson.core.JsonParser;
import org.apache.flink.shaded.jackson2.com.fasterxml.jackson.databind.DeserializationContext;
import org.apache.flink.shaded.jackson2.com.fasterxml.jackson.databind.JsonDeserializer;
import org.apache.flink.shaded.jackson2.com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import org.apache.flink.shaded.jackson2.com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize
@JsonIgnoreProperties(ignoreUnknown = true)
public class PostsDbEvent {

	PostsDbEventPayload payload;

	public class PostsDbEventPayload {

		@JsonProperty("op")
		@JsonDeserialize(using = PostsDbEventOperationDeserializer.class)
		PostsDbEventOperation op;

		@JsonProperty("id")
		String id;

		@JsonProperty("owner_id")
		String ownerId;
	}

	public enum PostsDbEventOperation {
		CREATE,
		DELETE
	}

	public class PostsDbEventOperationDeserializer extends JsonDeserializer<PostsDbEventOperation> {
    @Override
    public PostsDbEventOperation deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException {
			String valueAsString = jsonParser.getText( );

			switch (valueAsString) {
				case "c":
					return PostsDbEvent.PostsDbEventOperation.CREATE;

				case "d":
					return PostsDbEvent.PostsDbEventOperation.DELETE;

				default:
					throw new IllegalArgumentException("Invalid value for op: " + valueAsString);
			}
    }
	}
}