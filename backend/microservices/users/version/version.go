package version

import (
	"context"
	_ "embed"
	"strings"

	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/assert"
	"golang.org/x/mod/semver"
)

//go:embed .version
var Version string

func init() {
	// Remove newline character (added to the file automatically by formatter :)).
	Version, _ = strings.CutSuffix(Version, "\n")

	// Ensure that the .version file contains a valid semantic version.
	isVersionValid := semver.IsValid(Version)
	assert.Assert(context.Background(), isVersionValid, ".version contains invalid version")
}
