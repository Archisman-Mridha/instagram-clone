package profiles

import (
	"context"

	sharedTypes "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/types"
	sharedUtils "github.com/Archisman-Mridha/instagram-clone/backend/shared/pkg/utils"
	goValidator "github.com/go-playground/validator/v10"
)

type ProfilesService struct {
	validator *goValidator.Validate

	profilesRepository ProfilesRepository
	searchEngine       SearchEngine
}

func NewProfilesService(
	validator *goValidator.Validate,
	profilesRespository ProfilesRepository,
	searchEngine SearchEngine,
) *ProfilesService {
	sharedUtils.RegisterCustomFieldValidators(validator, map[string]goValidator.Func{})

	return &ProfilesService{
		validator,
		profilesRespository,
		searchEngine,
	}
}

type CreateProfileArgs struct {
	ID sharedTypes.ID
	Name,
	Username string
}

func (p *ProfilesService) CreateProfile(ctx context.Context, args *CreateProfileArgs) error {
	return p.profilesRepository.Create(ctx, (*CreateProfileArgs)(args))
}

func (p *ProfilesService) GetProfilePreviews(ctx context.Context, ids []sharedTypes.ID) ([]*ProfilePreview, error) {
	return p.profilesRepository.GetPreviews(ctx, ids)
}

func (p *ProfilesService) IndexProfile(ctx context.Context, profilePreview *ProfilePreview) error {
	return p.searchEngine.IndexProfile(ctx, profilePreview)
}

type SearchProfilesArgs struct {
	Query          string `validate:"notblank"`
	PaginationArgs *sharedTypes.PaginationArgs
}

func (p *ProfilesService) SearchProfiles(ctx context.Context, args *SearchProfilesArgs) ([]*ProfilePreview, error) {
	// Validate input.
	err := p.validator.StructCtx(ctx, args)
	if err != nil {
		return nil, err
	}

	return p.searchEngine.SearchProfiles(ctx, (*SearchProfilesArgs)(args))
}
