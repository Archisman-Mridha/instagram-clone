package api

import (
	"context"

	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/users/cmd/server/grpc/api/proto/generated"
	usersService "github.com/Archisman-Mridha/instagram-clone/backend/microservices/users/internal/services/users"
	"github.com/aws/aws-sdk-go/aws"
	"google.golang.org/protobuf/types/known/emptypb"
)

type GRPCAPI struct {
	generated.UnimplementedUsersServiceServer

	usersService *usersService.UsersService
}

func NewGRPCAPI(usersService *usersService.UsersService) *GRPCAPI {
	return &GRPCAPI{
		usersService: usersService,
	}
}

func (*GRPCAPI) Ping(context.Context, *emptypb.Empty) (*emptypb.Empty, error) {
	return &emptypb.Empty{}, nil
}

func (g *GRPCAPI) Signup(ctx context.Context,
	request *generated.SignupRequest,
) (*generated.SigninResponse, error) {
	output, err := g.usersService.Signup(ctx, &usersService.SignupArgs{
		Name:     request.Name,
		Email:    request.Email,
		Username: request.Username,
		Password: request.Password,
	})
	if err != nil {
		return nil, err
	}

	response := &generated.SigninResponse{
		Jwt: output.JWT,
	}
	return response, nil
}

func (g *GRPCAPI) Signin(ctx context.Context,
	request *generated.SigninRequest,
) (*generated.SigninResponse, error) {
	args := &usersService.SigninArgs{
		Password: request.Password,
	}
	switch request.Identifier.(type) {
	case *generated.SigninRequest_Email:
		args.Email = aws.String(request.GetEmail())

	case *generated.SigninRequest_Username:
		args.Username = aws.String(request.GetUsername())
	}

	output, err := g.usersService.Signin(ctx, args)
	if err != nil {
		return nil, err
	}

	response := &generated.SigninResponse{
		Jwt: output.JWT,
	}
	return response, nil
}

func (g *GRPCAPI) GetUserIDFromJWT(ctx context.Context,
	request *generated.GetUserIDFromJWTRequest,
) (*generated.GetUserIDFromJWTResponse, error) {
	userID, err := g.usersService.GetUserIDFromJWT(ctx, request.Jwt)
	if err != nil {
		return nil, err
	}

	response := &generated.GetUserIDFromJWTResponse{
		UserId: *userID,
	}
	return response, nil
}
