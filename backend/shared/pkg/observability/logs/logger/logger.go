package logger

import (
	"log/slog"
	"os"

	"github.com/lmittmann/tint"
)

// Sets up the logger.
func SetupLogger(debugLoggingEnabled, devModeEnabled bool) {
	logLevel := slog.LevelInfo
	if debugLoggingEnabled {
		logLevel = slog.LevelDebug
	}

	var formatHandler slog.Handler = slog.NewJSONHandler(os.Stderr, &slog.HandlerOptions{
		Level:       logLevel,
		ReplaceAttr: replaceSlogAttr,
	})
	if devModeEnabled {
		formatHandler = tint.NewHandler(os.Stderr, &tint.Options{
			Level:       logLevel,
			ReplaceAttr: replaceSlogAttr,
		})
	}

	logger := slog.New(withContextualSlogAttributesHandler(withTraceAndSpanIDHandler(formatHandler)))
	slog.SetDefault(logger)
}

func replaceSlogAttr(groups []string, a slog.Attr) slog.Attr {
	if a.Key == slog.TimeKey {
		a.Value = slog.StringValue(a.Value.Time().Format("15:04"))
	}
	return a
}

func Error(err error) slog.Attr {
	return slog.Any("error", err)
}
