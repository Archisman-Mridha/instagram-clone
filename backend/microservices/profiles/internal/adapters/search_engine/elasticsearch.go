package search_engine

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"strconv"

	"github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/internal/constants"
	coreTypes "github.com/Archisman-Mridha/instagram-clone/backend/microservices/profiles/internal/core/types"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/assert"
	"github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/connectors"
	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
	"github.com/aquasecurity/esquery"
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

// NOTE : Needs to be idempotent, since this is invoked by a DB event processor.
func (s *SearchEngineAdapter) IndexProfile(ctx context.Context,
	profilePreview *coreTypes.ProfilePreview,
) error {
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

func (s *SearchEngineAdapter) SearchProfiles(ctx context.Context,
	query string,
	paginationArgs *sharedTypes.PaginationArgs,
) ([]*coreTypes.ProfilePreview, error) {
	profilePreviews := []*coreTypes.ProfilePreview{}

	searchQuery, err := esquery.Search().
		Query(
			esquery.MultiMatch(query).
				Type(esquery.MatchTypePhrasePrefix).
				Fields("name", "username"),
		).
		Sort("_id", esquery.OrderAsc).
		Size(paginationArgs.PageSize).
		SearchAfter(paginationArgs.Offset).
		MarshalJSON()
	assert.AssertErrNil(ctx, err, "Failed JSON marshalling Elasticsearch search query")

	elasticsearchSearchClient := s.GetClient().Search

	response, err := elasticsearchSearchClient(
		elasticsearchSearchClient.WithBody(bytes.NewReader(searchQuery)),
		elasticsearchSearchClient.WithContext(ctx),
		elasticsearchSearchClient.WithIndex(constants.SEARCH_ENGINE_INDEX_PROFILES),
	)
	if (err != nil) || (response.IsError()) {
		return profilePreviews, sharedUtils.WrapErrorWithPrefix("Failed running Elasticsearch search query", err)
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
