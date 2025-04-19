package api

import (
	"context"

	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/users/cmd/server/grpc/api/proto/generated"
	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/users/internal/core/usecases"
	"github.com/aws/aws-sdk-go/aws"
	"google.golang.org/protobuf/types/known/emptypb"
)

type GRPCAPI struct {
	generated.UnimplementedUsersServiceServer

	usecases *usecases.Usecases
}

func NewGRPCAPI(usecases *usecases.Usecases) *GRPCAPI {
	return &GRPCAPI{usecases: usecases}
}

func (*GRPCAPI) Ping(context.Context, *emptypb.Empty) (*emptypb.Empty, error) {
	return &emptypb.Empty{}, nil
}

func (g *GRPCAPI) Signup(ctx context.Context,
	request *generated.SignupRequest,
) (*generated.SigninResponse, error) {
	output, err := g.usecases.Signup(ctx, &usecases.SignupArgs{
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
	args := &usecases.SigninArgs{
		Password: request.Password,
	}
	switch request.Identifier.(type) {
	case *generated.SigninRequest_Email:
		args.Email = aws.String(request.GetEmail())

	case *generated.SigninRequest_Username:
		args.Username = aws.String(request.GetUsername())
	}

	output, err := g.usecases.Signin(ctx, args)
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
	userID, err := g.usecases.GetUserIDFromJWT(ctx, request.Jwt)
	if err != nil {
		return nil, err
	}

	response := &generated.GetUserIDFromJWTResponse{
		UserId: *userID,
	}
	return response, nil
}
