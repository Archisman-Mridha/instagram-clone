package graphql_generated

import grpc_generated "github.com/Archisman-Mridha/instagram-clone/backend/gateway/generated/grpc"

func ProfilePreviewsToGraphQL(grpcVersion []*grpc_generated.ProfilePreview) []*ProfilePreview {
	result := make([]*ProfilePreview, len(grpcVersion))

	for index, item := range grpcVersion {
		result[index] = &ProfilePreview{
			ID: int(item.Id),

			Name:     item.Name,
			Username: item.Username,

			ProfilePictureURI: nil,
		}
	}

	return result
}

func PostsToGraphQL(grpcVersion []*grpc_generated.Post) []*Post {
	result := make([]*Post, len(grpcVersion))

	for index, item := range grpcVersion {
		result[index] = &Post{
			ID:      int(item.Id),
			OwnerID: int(item.OwnerId),

			Description: item.Description,
			CreatedAt:   item.CreatedAt,
		}
	}

	return result
}
