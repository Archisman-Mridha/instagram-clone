// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package graphql_generated

type AuthenticationOutput struct {
	UserID int    `json:"userId"`
	Jwt    string `json:"jwt"`
}

type CreatePostArgs struct {
	Description string `json:"description"`
}

type GetFeedArgs struct {
	PageSize int `json:"pageSize"`
	Offset   int `json:"offset"`
}

type GetFollowersArgs struct {
	UserID   int `json:"userId"`
	PageSize int `json:"pageSize"`
	Offset   int `json:"offset"`
}

type GetFollowingsArgs struct {
	UserID   int `json:"userId"`
	PageSize int `json:"pageSize"`
	Offset   int `json:"offset"`
}

type GetPostsOfUserArgs struct {
	UserID   int `json:"userId"`
	PageSize int `json:"pageSize"`
	Offset   int `json:"offset"`
}

type GetProfileArgs struct {
	UserID             int `json:"userId"`
	MaxRecentPostCount int `json:"maxRecentPostCount"`
}

type Mutation struct {
}

type Post struct {
	ID          int    `json:"id"`
	OwnerID     int    `json:"ownerId"`
	Description string `json:"description"`
	CreatedAt   string `json:"createdAt"`
}

type Profile struct {
	ID                int     `json:"id"`
	Name              string  `json:"name"`
	Username          string  `json:"username"`
	ProfilePictureURI *string `json:"profilePictureUri,omitempty"`
	FollowerCount     int     `json:"followerCount"`
	FollowingCount    int     `json:"followingCount"`
	IsFollowee        bool    `json:"isFollowee"`
	RecentPosts       []*Post `json:"recentPosts"`
}

type ProfilePreview struct {
	ID                int     `json:"id"`
	Name              string  `json:"name"`
	Username          string  `json:"username"`
	ProfilePictureURI *string `json:"profilePictureUri,omitempty"`
}

type Query struct {
}

type SearchProfilesArgs struct {
	Query string `json:"query"`
}

type SearchProfilesOutput struct {
	ProfilePreviews []*ProfilePreview `json:"profilePreviews"`
}

type SigninArgs struct {
	Identifier string `json:"identifier"`
	Password   string `json:"password"`
}

type SignupArgs struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}
