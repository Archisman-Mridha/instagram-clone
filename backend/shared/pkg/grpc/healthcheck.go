package grpc

import (
	"context"

	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/healthcheck"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/health/grpc_health_v1"
	"google.golang.org/grpc/status"
)

type HealthcheckService struct {
	healthcheckables []healthcheck.Healthcheckable
}

func (h *HealthcheckService) Check(ctx context.Context,
	request *grpc_health_v1.HealthCheckRequest,
) (*grpc_health_v1.HealthCheckResponse, error) {
	response := &grpc_health_v1.HealthCheckResponse{}

	err := healthcheck.Healthcheck(h.healthcheckables)
	if err != nil {
		response.Status = grpc_health_v1.HealthCheckResponse_NOT_SERVING
		return response, err
	}

	return response, nil
}

func (h *HealthcheckService) Watch(
	request *grpc_health_v1.HealthCheckRequest,
	responseStream grpc.ServerStreamingServer[grpc_health_v1.HealthCheckResponse],
) error {
	return status.Error(codes.Unimplemented, "unimplemented")
}
