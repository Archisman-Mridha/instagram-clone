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

export type CreateFollowshipRequestBody = {
  followeeID: Scalars['Int']['input'];
};

export type CreatePostRequestBody = {
  description?: InputMaybe<Scalars['String']['input']>;
  imageURL: Scalars['String']['input'];
};

export type CreatePostResponseBody = {
  __typename?: 'CreatePostResponseBody';
  id: Scalars['ID']['output'];
};

export type CreateUserRequestBody = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type DeleteFollowshipRequestBody = {
  followeeID: Scalars['Int']['input'];
};

export type GetFeedRequestBody = {
  skip?: Scalars['Int']['input'];
  take?: Scalars['Int']['input'];
  userID: Scalars['Int']['input'];
};

export type GetFeedResponseBody = {
  __typename?: 'GetFeedResponseBody';
  count: Scalars['Int']['output'];
  posts: Array<PostEntity>;
};

export type GetFolloweesRequestBody = {
  followerID: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
  take?: Scalars['Int']['input'];
};

export type GetFolloweesResponseBody = {
  __typename?: 'GetFolloweesResponseBody';
  count: Scalars['Int']['output'];
  followees: Array<ProfilePreview>;
};

export type GetFollowersRequestBody = {
  followeeID: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
  take?: Scalars['Int']['input'];
};

export type GetFollowersResponseBody = {
  __typename?: 'GetFollowersResponseBody';
  count: Scalars['Int']['output'];
  followers: Array<ProfilePreview>;
};

export type GetNotificationsRequestBody = {
  skip?: Scalars['Int']['input'];
  take?: Scalars['Int']['input'];
};

export type GetNotificationsResponseBody = {
  __typename?: 'GetNotificationsResponseBody';
  count: Scalars['Int']['output'];
  notifications: Array<Notification>;
};

export type GetPostsByAuthorRequestBody = {
  authorID: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
  take?: Scalars['Int']['input'];
};

export type GetPostsByAuthorResponseBody = {
  __typename?: 'GetPostsByAuthorResponseBody';
  count: Scalars['Int']['output'];
  posts: Array<PostEntity>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: CreatePostResponseBody;
  createUser: SigninOutput;
  follow: Scalars['Boolean']['output'];
  getPresignedPostImageURL: Scalars['String']['output'];
  unfollow: Scalars['Boolean']['output'];
};


export type MutationCreatePostArgs = {
  input: CreatePostRequestBody;
};


export type MutationCreateUserArgs = {
  input: CreateUserRequestBody;
};


export type MutationFollowArgs = {
  input: CreateFollowshipRequestBody;
};


export type MutationUnfollowArgs = {
  input: DeleteFollowshipRequestBody;
};

export type Notification = {
  __typename?: 'Notification';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['Timestamp']['output'];
  kind: Scalars['Float']['output'];
  seen: Scalars['Boolean']['output'];
  userID: Scalars['Int']['output'];
};

export type PostEntity = {
  __typename?: 'PostEntity';
  authorID: Scalars['Int']['output'];
  authorProfilePreview: ProfilePreview;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageURL: Scalars['String']['output'];
};

export type ProfilePreview = {
  __typename?: 'ProfilePreview';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  getFeed: GetFeedResponseBody;
  getFollowees: GetFolloweesResponseBody;
  getFollowers: GetFollowersResponseBody;
  getNotifications: GetNotificationsResponseBody;
  getPostsByAuthor: GetPostsByAuthorResponseBody;
  ping: Scalars['String']['output'];
  searchProfiles: SearchProfilesResponseBody;
  signin: SigninOutput;
};


export type QueryGetFeedArgs = {
  input: GetFeedRequestBody;
};


export type QueryGetFolloweesArgs = {
  input: GetFolloweesRequestBody;
};


export type QueryGetFollowersArgs = {
  input: GetFollowersRequestBody;
};


export type QueryGetNotificationsArgs = {
  input: GetNotificationsRequestBody;
};


export type QueryGetPostsByAuthorArgs = {
  input: GetPostsByAuthorRequestBody;
};


export type QuerySearchProfilesArgs = {
  input: SearchProfilesRequestBody;
};


export type QuerySigninArgs = {
  input: SigninInput;
};

export type SearchProfilesRequestBody = {
  query: Scalars['String']['input'];
  skip?: Scalars['Int']['input'];
  take?: Scalars['Int']['input'];
};

export type SearchProfilesResponseBody = {
  __typename?: 'SearchProfilesResponseBody';
  count: Scalars['Int']['output'];
  profilePreviews: Array<ProfilePreview>;
};

export type SigninInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SigninOutput = {
  __typename?: 'SigninOutput';
  accessToken: Scalars['String']['output'];
};

export type CreatePostMutationVariables = Exact<{
  input: CreatePostRequestBody;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'CreatePostResponseBody', id: string } };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserRequestBody;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'SigninOutput', accessToken: string } };

export type FollowMutationVariables = Exact<{
  input: CreateFollowshipRequestBody;
}>;


export type FollowMutation = { __typename?: 'Mutation', follow: boolean };

export type GetPresignedPostImageUrlMutationVariables = Exact<{ [key: string]: never; }>;


export type GetPresignedPostImageUrlMutation = { __typename?: 'Mutation', getPresignedPostImageURL: string };

export type UnfollowMutationVariables = Exact<{
  input: DeleteFollowshipRequestBody;
}>;


export type UnfollowMutation = { __typename?: 'Mutation', unfollow: boolean };

export type GetFeedQueryVariables = Exact<{
  input: GetFeedRequestBody;
}>;


export type GetFeedQuery = { __typename?: 'Query', getFeed: { __typename?: 'GetFeedResponseBody', count: number, posts: Array<{ __typename?: 'PostEntity', id: string, imageURL: string, description?: string | null, authorID: number, authorProfilePreview: { __typename?: 'ProfilePreview', id: string, name: string, username: string } }> } };

export type GetFolloweesQueryVariables = Exact<{
  input: GetFolloweesRequestBody;
}>;


export type GetFolloweesQuery = { __typename?: 'Query', getFollowees: { __typename?: 'GetFolloweesResponseBody', count: number, followees: Array<{ __typename?: 'ProfilePreview', id: string, name: string, username: string }> } };

export type GetFollowersQueryVariables = Exact<{
  input: GetFollowersRequestBody;
}>;


export type GetFollowersQuery = { __typename?: 'Query', getFollowers: { __typename?: 'GetFollowersResponseBody', count: number, followers: Array<{ __typename?: 'ProfilePreview', id: string, name: string, username: string }> } };

export type GetNotificationsQueryVariables = Exact<{
  input: GetNotificationsRequestBody;
}>;


export type GetNotificationsQuery = { __typename?: 'Query', getNotifications: { __typename?: 'GetNotificationsResponseBody', count: number, notifications: Array<{ __typename?: 'Notification', _id: string, userID: number, kind: number, seen: boolean, createdAt: any }> } };

export type GetPostsByAuthorQueryVariables = Exact<{
  input: GetPostsByAuthorRequestBody;
}>;


export type GetPostsByAuthorQuery = { __typename?: 'Query', getPostsByAuthor: { __typename?: 'GetPostsByAuthorResponseBody', count: number, posts: Array<{ __typename?: 'PostEntity', id: string, imageURL: string, description?: string | null, authorID: number, authorProfilePreview: { __typename?: 'ProfilePreview', id: string, name: string, username: string } }> } };

export type PingQueryVariables = Exact<{ [key: string]: never; }>;


export type PingQuery = { __typename?: 'Query', ping: string };

export type SearchProfilesQueryVariables = Exact<{
  input: SearchProfilesRequestBody;
}>;


export type SearchProfilesQuery = { __typename?: 'Query', searchProfiles: { __typename?: 'SearchProfilesResponseBody', count: number, profilePreviews: Array<{ __typename?: 'ProfilePreview', id: string, name: string, username: string }> } };

export type SigninQueryVariables = Exact<{
  input: SigninInput;
}>;


export type SigninQuery = { __typename?: 'Query', signin: { __typename?: 'SigninOutput', accessToken: string } };


export const CreatePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePostRequestBody"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreatePostMutation, CreatePostMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserRequestBody"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const FollowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Follow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateFollowshipRequestBody"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"follow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<FollowMutation, FollowMutationVariables>;
export const GetPresignedPostImageUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GetPresignedPostImageURL"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPresignedPostImageURL"}}]}}]} as unknown as DocumentNode<GetPresignedPostImageUrlMutation, GetPresignedPostImageUrlMutationVariables>;
export const UnfollowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Unfollow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteFollowshipRequestBody"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unfollow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UnfollowMutation, UnfollowMutationVariables>;
export const GetFeedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFeed"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetFeedRequestBody"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFeed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imageURL"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"authorID"}},{"kind":"Field","name":{"kind":"Name","value":"authorProfilePreview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetFeedQuery, GetFeedQueryVariables>;
export const GetFolloweesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFollowees"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetFolloweesRequestBody"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFollowees"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"followees"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<GetFolloweesQuery, GetFolloweesQueryVariables>;
export const GetFollowersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFollowers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetFollowersRequestBody"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFollowers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"followers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<GetFollowersQuery, GetFollowersQueryVariables>;
export const GetNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetNotificationsRequestBody"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getNotifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"userID"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"seen"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetNotificationsQuery, GetNotificationsQueryVariables>;
export const GetPostsByAuthorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPostsByAuthor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetPostsByAuthorRequestBody"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPostsByAuthor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imageURL"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"authorID"}},{"kind":"Field","name":{"kind":"Name","value":"authorProfilePreview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetPostsByAuthorQuery, GetPostsByAuthorQueryVariables>;
export const PingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Ping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ping"}}]}}]} as unknown as DocumentNode<PingQuery, PingQueryVariables>;
export const SearchProfilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchProfiles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchProfilesRequestBody"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchProfiles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"profilePreviews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<SearchProfilesQuery, SearchProfilesQueryVariables>;
export const SigninDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Signin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SigninInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]} as unknown as DocumentNode<SigninQuery, SigninQueryVariables>;