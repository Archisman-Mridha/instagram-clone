package logger

import (
	"log/slog"
	"os"
)

// Sets up the logger.
func SetupLogger(debugLoggingEnabled, devModeEnabled bool) {
	logLevel := slog.LevelInfo
	if debugLoggingEnabled {
		logLevel = slog.LevelDebug
	}

	formatHandlerOptions := &slog.HandlerOptions{
		Level: logLevel,

		ReplaceAttr: func(groups []string, a slog.Attr) slog.Attr {
			if a.Key == slog.TimeKey {
				a.Value = slog.StringValue(a.Value.Time().Format("15:04"))
			}
			return a
		},
	}

	var formatHandler slog.Handler
	if devModeEnabled {
		formatHandler = slog.NewTextHandler(os.Stderr, formatHandlerOptions)
	} else {
		formatHandler = slog.NewJSONHandler(os.Stderr, formatHandlerOptions)
	}

	logger := slog.New(withContextualSlogAttributesHandler(withTraceIDHandler(formatHandler)))
	slog.SetDefault(logger)
}

func Error(err error) slog.Attr {
	return slog.Any("error", err)
}
