/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** `Date` type as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: { input: any; output: any; }
};

export type CreateFollowshipArgs = {
  followeeID: Scalars['Int']['input'];
};

export type CreatePostArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  imageURL: Scalars['String']['input'];
};

export type CreateUserArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type DeleteFollowshipArgs = {
  followeeID: Scalars['Int']['input'];
};

export type Feed = {
  __typename?: 'Feed';
  count: Scalars['Int']['output'];
  postIDs: Array<Scalars['Float']['output']>;
  posts: Array<Post>;
};

export type Followee = {
  __typename?: 'Followee';
  id: Scalars['Int']['output'];
  profilePreview: ProfilePreview;
};

export type Followees = {
  __typename?: 'Followees';
  count: Scalars['Int']['output'];
  followees: Array<Followee>;
};

export type Follower = {
  __typename?: 'Follower';
  id: Scalars['Int']['output'];
  profilePreview: ProfilePreview;
};

export type Followers = {
  __typename?: 'Followers';
  count: Scalars['Int']['output'];
  followers: Array<Follower>;
};

export type FollowshipCounts = {
  __typename?: 'FollowshipCounts';
  followeeCount: Scalars['Int']['output'];
  followerCount: Scalars['Int']['output'];
};

export type GetFeedArgs = {
  skip?: Scalars['Int']['input'];
  take?: Scalars['Int']['input'];
  userID: Scalars['Int']['input'];
};

export type GetFolloweesArgs = {
  followerID: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
  take?: Scalars['Int']['input'];
};

export type GetFollowersArgs = {
  followeeID: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
  take?: Scalars['Int']['input'];
};

export type GetNotificationsArgs = {
  skip?: Scalars['Int']['input'];
  take?: Scalars['Int']['input'];
};

export type GetPostArgs = {
  id: Scalars['Int']['input'];
};

export type GetPostsByAuthorArgs = {
  authorID: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
  take?: Scalars['Int']['input'];
};

export type GetProfileByIdArgs = {
  id: Scalars['Int']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Scalars['Float']['output'];
  createUser: SigninOutput;
  follow: Scalars['Boolean']['output'];
  getPresignedPostImageURL: Scalars['String']['output'];
  unfollow: Scalars['Boolean']['output'];
};


export type MutationCreatePostArgs = {
  args: CreatePostArgs;
};


export type MutationCreateUserArgs = {
  args: CreateUserArgs;
};


export type MutationFollowArgs = {
  args: CreateFollowshipArgs;
};


export type MutationUnfollowArgs = {
  args: DeleteFollowshipArgs;
};

export type Notification = {
  __typename?: 'Notification';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['Timestamp']['output'];
  kind: Scalars['Float']['output'];
  seen: Scalars['Boolean']['output'];
  userID: Scalars['Int']['output'];
};

export type Notifications = {
  __typename?: 'Notifications';
  count: Scalars['Int']['output'];
  notifications: Array<Notification>;
};

export type Post = {
  __typename?: 'Post';
  authorID: Scalars['Int']['output'];
  authorProfilePreview: ProfilePreview;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageURL: Scalars['String']['output'];
};

export type Posts = {
  __typename?: 'Posts';
  count: Scalars['Int']['output'];
  posts: Array<Post>;
};

export type Profile = {
  __typename?: 'Profile';
  bio?: Maybe<Scalars['String']['output']>;
  followshipCounts: FollowshipCounts;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  posts: Array<Post>;
  username: Scalars['String']['output'];
};

export type ProfilePreview = {
  __typename?: 'ProfilePreview';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type ProfilePreviews = {
  __typename?: 'ProfilePreviews';
  count: Scalars['Int']['output'];
  profilePreviews: Array<ProfilePreview>;
};

export type Query = {
  __typename?: 'Query';
  getFeed: Feed;
  getFollowees: Followees;
  getFollowers: Followers;
  getNotifications: Notifications;
  getPostByID: Post;
  getPostsByAuthor: Posts;
  getProfileByID: Profile;
  ping: Scalars['String']['output'];
  searchProfiles: ProfilePreviews;
  signin: SigninOutput;
};


export type QueryGetFeedArgs = {
  args: GetFeedArgs;
};


export type QueryGetFolloweesArgs = {
  args: GetFolloweesArgs;
};


export type QueryGetFollowersArgs = {
  args: GetFollowersArgs;
};


export type QueryGetNotificationsArgs = {
  args: GetNotificationsArgs;
};


export type QueryGetPostByIdArgs = {
  args: GetPostArgs;
};


export type QueryGetPostsByAuthorArgs = {
  args: GetPostsByAuthorArgs;
};


export type QueryGetProfileByIdArgs = {
  args: GetProfileByIdArgs;
};


export type QuerySearchProfilesArgs = {
  args: SearchProfilesArgs;
};


export type QuerySigninArgs = {
  args: SigninArgs;
};

export type SearchProfilesArgs = {
  query: Scalars['String']['input'];
  skip?: Scalars['Int']['input'];
  take?: Scalars['Int']['input'];
};

export type SigninArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SigninOutput = {
  __typename?: 'SigninOutput';
  accessToken: Scalars['String']['output'];
  userID: Scalars['ID']['output'];
};

export type ProfilePreviewFragmentFragment = { __typename?: 'ProfilePreview', id: string, name: string, username: string } & { ' $fragmentName'?: 'ProfilePreviewFragmentFragment' };

export type PostFragmentFragment = { __typename?: 'Post', id: string, imageURL: string, description?: string | null, authorProfilePreview: (
    { __typename?: 'ProfilePreview' }
    & { ' $fragmentRefs'?: { 'ProfilePreviewFragmentFragment': ProfilePreviewFragmentFragment } }
  ) } & { ' $fragmentName'?: 'PostFragmentFragment' };

export type CreatePostMutationVariables = Exact<{
  args: CreatePostArgs;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: number };

export type CreateUserMutationVariables = Exact<{
  args: CreateUserArgs;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'SigninOutput', accessToken: string, userID: string } };

export type FollowMutationVariables = Exact<{
  args: CreateFollowshipArgs;
}>;


export type FollowMutation = { __typename?: 'Mutation', follow: boolean };

export type GetPresignedPostImageUrlMutationVariables = Exact<{ [key: string]: never; }>;


export type GetPresignedPostImageUrlMutation = { __typename?: 'Mutation', getPresignedPostImageURL: string };

export type UnfollowMutationVariables = Exact<{
  args: DeleteFollowshipArgs;
}>;


export type UnfollowMutation = { __typename?: 'Mutation', unfollow: boolean };

export type GetFeedQueryVariables = Exact<{
  args: GetFeedArgs;
}>;


export type GetFeedQuery = { __typename?: 'Query', getFeed: { __typename?: 'Feed', count: number, postIDs: Array<number>, posts: Array<(
      { __typename?: 'Post' }
      & { ' $fragmentRefs'?: { 'PostFragmentFragment': PostFragmentFragment } }
    )> } };

export type GetFolloweesQueryVariables = Exact<{
  args: GetFolloweesArgs;
}>;


export type GetFolloweesQuery = { __typename?: 'Query', getFollowees: { __typename?: 'Followees', count: number, followees: Array<{ __typename?: 'Followee', id: number, profilePreview: (
        { __typename?: 'ProfilePreview' }
        & { ' $fragmentRefs'?: { 'ProfilePreviewFragmentFragment': ProfilePreviewFragmentFragment } }
      ) }> } };

export type GetFollowersQueryVariables = Exact<{
  args: GetFollowersArgs;
}>;


export type GetFollowersQuery = { __typename?: 'Query', getFollowers: { __typename?: 'Followers', count: number, followers: Array<{ __typename?: 'Follower', id: number, profilePreview: (
        { __typename?: 'ProfilePreview' }
        & { ' $fragmentRefs'?: { 'ProfilePreviewFragmentFragment': ProfilePreviewFragmentFragment } }
      ) }> } };

export type GetPostByIdQueryVariables = Exact<{
  args: GetPostArgs;
}>;


export type GetPostByIdQuery = { __typename?: 'Query', getPostByID: (
    { __typename?: 'Post' }
    & { ' $fragmentRefs'?: { 'PostFragmentFragment': PostFragmentFragment } }
  ) };

export type GetPostsByAuthorQueryVariables = Exact<{
  args: GetPostsByAuthorArgs;
}>;


export type GetPostsByAuthorQuery = { __typename?: 'Query', getPostsByAuthor: { __typename?: 'Posts', count: number, posts: Array<(
      { __typename?: 'Post' }
      & { ' $fragmentRefs'?: { 'PostFragmentFragment': PostFragmentFragment } }
    )> } };

export type GetProfileByIdQueryVariables = Exact<{
  args: GetProfileByIdArgs;
}>;


export type GetProfileByIdQuery = { __typename?: 'Query', getProfileByID: { __typename?: 'Profile', id: string, name: string, username: string, bio?: string | null, followshipCounts: { __typename?: 'FollowshipCounts', followeeCount: number, followerCount: number }, posts: Array<(
      { __typename?: 'Post' }
      & { ' $fragmentRefs'?: { 'PostFragmentFragment': PostFragmentFragment } }
    )> } };

export type PingQueryVariables = Exact<{ [key: string]: never; }>;


export type PingQuery = { __typename?: 'Query', ping: string };

export type SearchProfilesQueryVariables = Exact<{
  args: SearchProfilesArgs;
}>;


export type SearchProfilesQuery = { __typename?: 'Query', searchProfiles: { __typename?: 'ProfilePreviews', count: number, profilePreviews: Array<(
      { __typename?: 'ProfilePreview' }
      & { ' $fragmentRefs'?: { 'ProfilePreviewFragmentFragment': ProfilePreviewFragmentFragment } }
    )> } };

export type SigninQueryVariables = Exact<{
  args: SigninArgs;
}>;


export type SigninQuery = { __typename?: 'Query', signin: { __typename?: 'SigninOutput', accessToken: string, userID: string } };

export const ProfilePreviewFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfilePreviewFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProfilePreview"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]} as unknown as DocumentNode<ProfilePreviewFragmentFragment, unknown>;
export const PostFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PostFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imageURL"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"authorProfilePreview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfilePreviewFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfilePreviewFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProfilePreview"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]} as unknown as DocumentNode<PostFragmentFragment, unknown>;
export const CreatePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePostArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"args"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}]}]}}]} as unknown as DocumentNode<CreatePostMutation, CreatePostMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"args"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"userID"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const FollowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Follow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateFollowshipArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"follow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"args"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}]}]}}]} as unknown as DocumentNode<FollowMutation, FollowMutationVariables>;
export const GetPresignedPostImageUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GetPresignedPostImageURL"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPresignedPostImageURL"}}]}}]} as unknown as DocumentNode<GetPresignedPostImageUrlMutation, GetPresignedPostImageUrlMutationVariables>;
export const UnfollowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Unfollow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteFollowshipArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unfollow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"args"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}]}]}}]} as unknown as DocumentNode<UnfollowMutation, UnfollowMutationVariables>;
export const GetFeedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFeed"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetFeedArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFeed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"args"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"postIDs"}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PostFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfilePreviewFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProfilePreview"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PostFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imageURL"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"authorProfilePreview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfilePreviewFragment"}}]}}]}}]} as unknown as DocumentNode<GetFeedQuery, GetFeedQueryVariables>;
export const GetFolloweesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFollowees"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetFolloweesArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFollowees"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"args"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"followees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profilePreview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfilePreviewFragment"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfilePreviewFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProfilePreview"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]} as unknown as DocumentNode<GetFolloweesQuery, GetFolloweesQueryVariables>;
export const GetFollowersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFollowers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetFollowersArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFollowers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"args"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"followers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profilePreview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfilePreviewFragment"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfilePreviewFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProfilePreview"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]} as unknown as DocumentNode<GetFollowersQuery, GetFollowersQueryVariables>;
export const GetPostByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPostByID"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetPostArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPostByID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"args"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PostFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfilePreviewFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProfilePreview"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PostFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imageURL"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"authorProfilePreview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfilePreviewFragment"}}]}}]}}]} as unknown as DocumentNode<GetPostByIdQuery, GetPostByIdQueryVariables>;
export const GetPostsByAuthorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPostsByAuthor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetPostsByAuthorArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPostsByAuthor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"args"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PostFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfilePreviewFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProfilePreview"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PostFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imageURL"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"authorProfilePreview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfilePreviewFragment"}}]}}]}}]} as unknown as DocumentNode<GetPostsByAuthorQuery, GetPostsByAuthorQueryVariables>;
export const GetProfileByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProfileByID"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetProfileByIDArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getProfileByID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"args"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"followshipCounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"followeeCount"}},{"kind":"Field","name":{"kind":"Name","value":"followerCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PostFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfilePreviewFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProfilePreview"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PostFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imageURL"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"authorProfilePreview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfilePreviewFragment"}}]}}]}}]} as unknown as DocumentNode<GetProfileByIdQuery, GetProfileByIdQueryVariables>;
export const PingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Ping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ping"}}]}}]} as unknown as DocumentNode<PingQuery, PingQueryVariables>;
export const SearchProfilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchProfiles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchProfilesArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchProfiles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"args"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"profilePreviews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfilePreviewFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfilePreviewFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProfilePreview"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]} as unknown as DocumentNode<SearchProfilesQuery, SearchProfilesQueryVariables>;
export const SigninDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Signin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"args"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SigninArgs"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"args"},"value":{"kind":"Variable","name":{"kind":"Name","value":"args"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"userID"}}]}}]}}]} as unknown as DocumentNode<SigninQuery, SigninQueryVariables>;