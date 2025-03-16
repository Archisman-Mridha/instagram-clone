package api

import (
	"context"

	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/cmd/server/grpc/api/proto/generated"
	coreTypes "github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/internal/core/types"
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/internal/core/usecases"
	"google.golang.org/protobuf/types/known/emptypb"
)

type GRPCAPI struct {
	generated.UnimplementedProfilesServiceServer

	usecases *usecases.Usecases
}

func NewGRPCAPI(usecases *usecases.Usecases) *GRPCAPI {
	return &GRPCAPI{usecases: usecases}
}

func (*GRPCAPI) Ping(context.Context, *emptypb.Empty) (*emptypb.Empty, error) {
	return &emptypb.Empty{}, nil
}

func (g *GRPCAPI) SearchProfiles(ctx context.Context,
	request *generated.SearchProfilesRequest,
) (*generated.SearchProfilesResponse, error) {
	profilePreviews, err := g.usecases.SearchProfiles(ctx, request.Query)
	if err != nil {
		return nil, err
	}

	response := &generated.SearchProfilesResponse{
		ProfilePreviews: toProtoGeneratedProfilePreviews(profilePreviews),
	}
	return response, nil
}

func (g *GRPCAPI) GetProfilePreviews(ctx context.Context,
	request *generated.GetProfilePreviewsRequest,
) (*generated.GetProfilePreviewsResponse, error) {
	profilePreviews, err := g.usecases.GetProfilePreviews(ctx, request.Ids)
	if err != nil {
		return nil, err
	}

	response := &generated.GetProfilePreviewsResponse{
		ProfilePreviews: toProtoGeneratedProfilePreviews(profilePreviews),
	}
	return response, nil
}

// Converts []*coreTypes.ProfilePreview to []*generated.ProfilePreiew.
func toProtoGeneratedProfilePreviews(input []*coreTypes.ProfilePreview) []*generated.ProfilePreview {
	output := []*generated.ProfilePreview{}
	for _, item := range input {
		output = append(output, &generated.ProfilePreview{
			Id:       item.ID,
			Name:     item.Name,
			Username: item.Username,
		})
	}
	return output
}
