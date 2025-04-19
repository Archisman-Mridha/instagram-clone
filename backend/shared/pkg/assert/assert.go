package assert

import (
	"context"
	"log/slog"
	"os"

	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/observability/logs/logger"
)

// Panics if the given error isn't nil.
func AssertErrNil(ctx context.Context, err error, contextualErrorMessage string, attributes ...any) {
	if err == nil {
		return
	}

	attributes = append(attributes, logger.Error(err))
	slog.ErrorContext(ctx, contextualErrorMessage, attributes...)
	os.Exit(1)
}

// Panics if the condition is false.
func Assert(ctx context.Context, condition bool, contextualErrorMessage string, attributes ...any) {
	if condition {
		return
	}

	slog.ErrorContext(ctx, contextualErrorMessage, attributes...)
	os.Exit(1)
}
