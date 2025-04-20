package api

import (
	"context"

	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/cmd/server/grpc/api/proto/generated"
	profilesService "github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/internal/services/profiles"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
	"google.golang.org/protobuf/types/known/emptypb"
)

type GRPCAPI struct {
	generated.UnimplementedProfilesServiceServer

	profilesService *profilesService.ProfilesService
}

func NewGRPCAPI(profilesService *profilesService.ProfilesService) *GRPCAPI {
	return &GRPCAPI{
		profilesService: profilesService,
	}
}

func (*GRPCAPI) Ping(context.Context, *emptypb.Empty) (*emptypb.Empty, error) {
	return &emptypb.Empty{}, nil
}

func (g *GRPCAPI) SearchProfiles(ctx context.Context,
	request *generated.SearchProfilesRequest,
) (*generated.SearchProfilesResponse, error) {
	profilePreviews, err := g.profilesService.SearchProfiles(ctx, &profilesService.SearchProfilesArgs{
		Query: request.Query,
		PaginationArgs: &types.PaginationArgs{
			Offset:   request.PaginationArgs.Offset,
			PageSize: request.PaginationArgs.PageSize,
		},
	})
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
	profilePreviews, err := g.profilesService.GetProfilePreviews(ctx, request.Ids)
	if err != nil {
		return nil, err
	}

	response := &generated.GetProfilePreviewsResponse{
		ProfilePreviews: toProtoGeneratedProfilePreviews(profilePreviews),
	}
	return response, nil
}

// Converts []*postsService.ProfilePreview to []*generated.ProfilePreiew.
func toProtoGeneratedProfilePreviews(input []*profilesService.ProfilePreview) []*generated.ProfilePreview {
	output := make([]*generated.ProfilePreview, len(input))
	for _, item := range input {
		output = append(output, &generated.ProfilePreview{
			Id:       item.ID,
			Name:     item.Name,
			Username: item.Username,
		})
	}
	return output
}
