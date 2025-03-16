package search_engine

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"strings"

	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/internal/constants"
	coreTypes "github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/internal/core/types"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/connectors"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
)

type (
	SearchEngineAdapter struct {
		*connectors.ElasticsearchConnector
	}

	ProfileMetadata struct {
		Name,
		Username string
	}
)

func NewSearchEngineAdapter(ctx context.Context,
	args *connectors.NewElasticsearchConnectorArgs,
) *SearchEngineAdapter {
	elasticsearchConnector := connectors.NewElasticsearchConnector(ctx, args)

	return &SearchEngineAdapter{elasticsearchConnector}
}

func (s *SearchEngineAdapter) IndexProfile(ctx context.Context, profilePreview *coreTypes.ProfilePreview) error {
	profileMetadata := ProfileMetadata{
		Name:     profilePreview.Name,
		Username: profilePreview.Username,
	}
	jsonEncodedProfileMetadata, err := json.Marshal(profileMetadata)
	if err != nil {
		return sharedUtils.WrapError(err)
	}

	elasticsearchIndexClient := s.GetClient().Index

	response, err := elasticsearchIndexClient(
		constants.SEARCH_ENGINE_INDEX_PROFILES,
		bytes.NewReader(jsonEncodedProfileMetadata),
		elasticsearchIndexClient.WithDocumentID(string(profilePreview.ID)),
		elasticsearchIndexClient.WithContext(ctx),
	)
	if err != nil {
		return sharedUtils.WrapError(err)
	} else if response.IsError() {
		return sharedUtils.WrapError(errors.New("Failed indexing profile, received error status-code"))
	}
	defer response.Body.Close()

	return nil
}

// TODO : use scrolling search instead of multi-search, so we can have pagination.
func (s *SearchEngineAdapter) SearchProfiles(ctx context.Context, query string) ([]*coreTypes.ProfilePreview, error) {
	profilePreviews := []*coreTypes.ProfilePreview{}

	elasticsearchMultiSearchClient := s.GetClient().Msearch

	multiSearchQuery := fmt.Sprintf(
		`
      {
        "query": {
          "multi_search": {
            "query": "%s",
            "type": "phrase_prefix",
            "fields": ["name", "username"]
          }
        }
      }
    `,
		query,
	)

	response, err := elasticsearchMultiSearchClient(strings.NewReader(multiSearchQuery),
		elasticsearchMultiSearchClient.WithContext(ctx),
		elasticsearchMultiSearchClient.WithIndex(constants.SEARCH_ENGINE_INDEX_PROFILES),
		elasticsearchMultiSearchClient.WithSearchType("query_then_fetch"),
	)
	if err != nil {
		return profilePreviews, sharedUtils.WrapError(err)
	} else if response.IsError() {
		return profilePreviews, sharedUtils.WrapError(errors.New("Failed running multi-search query, received error status-code"))
	}
	defer response.Body.Close()

	parsedResponseBody, err := sharedUtils.ParseElasticsearchSearchQueryResponseBody[ProfileMetadata](ctx, response.Body)
	if err != nil {
		return profilePreviews, sharedUtils.WrapError(err)
	}

	for _, hit := range parsedResponseBody.Hits.Hits {
		id, err := strconv.ParseInt(hit.ID, 10, 32)
		if err != nil {
			return profilePreviews, sharedUtils.WrapErrorWithPrefix("Failed parsing profile id to int32", err)
		}

		profilePreviews = append(profilePreviews, &coreTypes.ProfilePreview{
			ID:       int32(id),
			Name:     hit.Source.Name,
			Username: hit.Source.Username,
		})
	}

	return profilePreviews, nil
}
