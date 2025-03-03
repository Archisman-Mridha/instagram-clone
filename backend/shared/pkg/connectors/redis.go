package connectors

import (
	"context"
	"log/slog"
	"time"

	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/assert"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability/logs/logger"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
	"github.com/redis/go-redis/extra/redisotel/v9"
	"github.com/redis/go-redis/v9"
)

type (
	RedisConnector struct {
		client redis.UniversalClient
	}

	NewRedisConnectorArgs struct {
		NodeAddresses []string `yaml:"nodeAddresses" validate:"required,gt=0,dive,notblank"`

		Username string `yaml:"username" validate:"required,notblank"`
		Password string `yaml:"password" validate:"required,notblank"`
	}
)

func NewRedisConnector(ctx context.Context, args *NewRedisConnectorArgs) *RedisConnector {
	var client redis.UniversalClient
	if len(args.NodeAddresses) == 1 {
		client = redis.NewClient(&redis.Options{
			Addr: args.NodeAddresses[0],

			Username: args.Username,
			Password: args.Password,
		})
	} else {
		client = redis.NewClusterClient(&redis.ClusterOptions{
			Addrs: args.NodeAddresses,

			Username: args.Username,
			Password: args.Password,
		})
	}

	// Ping the cluster, verifying that a working connection has been established.
	err := client.Ping(ctx).Err()
	assert.AssertErrNil(ctx, err, "Failed connecting to Redis cluster")

	slog.DebugContext(ctx, "Connected to Redis cluster")

	// Instrument the Redis client
	{
		err = redisotel.InstrumentTracing(client)
		assert.AssertErrNil(ctx, err, "Failed trace instrumenting the Redis client")

		err = redisotel.InstrumentMetrics(client)
		assert.AssertErrNil(ctx, err, "Failed metric instrumenting the Redis client")
	}

	return &RedisConnector{client}
}

func (r *RedisConnector) Healthcheck() error {
	if err := r.client.Ping(context.Background()).Err(); err != nil {
		return sharedUtils.WrapErrorWithPrefix("Failed pinging Redis cluster", err)
	}
	return nil
}

func (r *RedisConnector) Set(ctx context.Context,
	key string,
	value interface{},
	expiration time.Duration,
) error {
	return r.client.Set(ctx, key, value, expiration).Err()
}

func (r *RedisConnector) Get(ctx context.Context, key string) (string, error) {
	return r.client.Get(ctx, key).Result()
}

func (r *RedisConnector) Del(ctx context.Context, keys ...string) error {
	return r.client.Del(ctx, keys...).Err()
}

func (r *RedisConnector) Shutdown() {
	if err := r.client.Close(); err != nil {
		slog.Error("Failed closing Redis connection", logger.Error(err))
		return
	}
	slog.Info("Shut down Redis client")
}
