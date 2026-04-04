/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "mutation CreatePost($input: CreatePostRequestBody!) {\n  createPost(input: $input) {\n    id\n  }\n}": typeof types.CreatePostDocument,
    "mutation CreateUser($input: CreateUserRequestBody!) {\n  createUser(input: $input) {\n    accessToken\n  }\n}": typeof types.CreateUserDocument,
    "mutation Follow($input: CreateFollowshipRequestBody!) {\n  follow(input: $input)\n}": typeof types.FollowDocument,
    "mutation GetPresignedPostImageURL {\n  getPresignedPostImageURL\n}": typeof types.GetPresignedPostImageUrlDocument,
    "mutation Unfollow($input: DeleteFollowshipRequestBody!) {\n  unfollow(input: $input)\n}": typeof types.UnfollowDocument,
    "query GetFeed($input: GetFeedRequestBody!) {\n  getFeed(input: $input) {\n    count\n    posts {\n      id\n      imageURL\n      description\n      authorID\n      authorProfilePreview {\n        id\n        name\n        username\n      }\n    }\n  }\n}": typeof types.GetFeedDocument,
    "query GetFollowees($input: GetFolloweesRequestBody!) {\n  getFollowees(input: $input) {\n    count\n    followees {\n      id\n      name\n      username\n    }\n  }\n}": typeof types.GetFolloweesDocument,
    "query GetFollowers($input: GetFollowersRequestBody!) {\n  getFollowers(input: $input) {\n    count\n    followers {\n      id\n      name\n      username\n    }\n  }\n}": typeof types.GetFollowersDocument,
    "query GetNotifications($input: GetNotificationsRequestBody!) {\n  getNotifications(input: $input) {\n    count\n    notifications {\n      _id\n      userID\n      kind\n      seen\n      createdAt\n    }\n  }\n}": typeof types.GetNotificationsDocument,
    "query GetPostsByAuthor($input: GetPostsByAuthorRequestBody!) {\n  getPostsByAuthor(input: $input) {\n    count\n    posts {\n      id\n      imageURL\n      description\n      authorID\n      authorProfilePreview {\n        id\n        name\n        username\n      }\n    }\n  }\n}": typeof types.GetPostsByAuthorDocument,
    "query Ping {\n  ping\n}": typeof types.PingDocument,
    "query SearchProfiles($input: SearchProfilesRequestBody!) {\n  searchProfiles(input: $input) {\n    count\n    profilePreviews {\n      id\n      name\n      username\n    }\n  }\n}": typeof types.SearchProfilesDocument,
    "query Signin($input: SigninInput!) {\n  signin(input: $input) {\n    accessToken\n  }\n}": typeof types.SigninDocument,
};
const documents: Documents = {
    "mutation CreatePost($input: CreatePostRequestBody!) {\n  createPost(input: $input) {\n    id\n  }\n}": types.CreatePostDocument,
    "mutation CreateUser($input: CreateUserRequestBody!) {\n  createUser(input: $input) {\n    accessToken\n  }\n}": types.CreateUserDocument,
    "mutation Follow($input: CreateFollowshipRequestBody!) {\n  follow(input: $input)\n}": types.FollowDocument,
    "mutation GetPresignedPostImageURL {\n  getPresignedPostImageURL\n}": types.GetPresignedPostImageUrlDocument,
    "mutation Unfollow($input: DeleteFollowshipRequestBody!) {\n  unfollow(input: $input)\n}": types.UnfollowDocument,
    "query GetFeed($input: GetFeedRequestBody!) {\n  getFeed(input: $input) {\n    count\n    posts {\n      id\n      imageURL\n      description\n      authorID\n      authorProfilePreview {\n        id\n        name\n        username\n      }\n    }\n  }\n}": types.GetFeedDocument,
    "query GetFollowees($input: GetFolloweesRequestBody!) {\n  getFollowees(input: $input) {\n    count\n    followees {\n      id\n      name\n      username\n    }\n  }\n}": types.GetFolloweesDocument,
    "query GetFollowers($input: GetFollowersRequestBody!) {\n  getFollowers(input: $input) {\n    count\n    followers {\n      id\n      name\n      username\n    }\n  }\n}": types.GetFollowersDocument,
    "query GetNotifications($input: GetNotificationsRequestBody!) {\n  getNotifications(input: $input) {\n    count\n    notifications {\n      _id\n      userID\n      kind\n      seen\n      createdAt\n    }\n  }\n}": types.GetNotificationsDocument,
    "query GetPostsByAuthor($input: GetPostsByAuthorRequestBody!) {\n  getPostsByAuthor(input: $input) {\n    count\n    posts {\n      id\n      imageURL\n      description\n      authorID\n      authorProfilePreview {\n        id\n        name\n        username\n      }\n    }\n  }\n}": types.GetPostsByAuthorDocument,
    "query Ping {\n  ping\n}": types.PingDocument,
    "query SearchProfiles($input: SearchProfilesRequestBody!) {\n  searchProfiles(input: $input) {\n    count\n    profilePreviews {\n      id\n      name\n      username\n    }\n  }\n}": types.SearchProfilesDocument,
    "query Signin($input: SigninInput!) {\n  signin(input: $input) {\n    accessToken\n  }\n}": types.SigninDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreatePost($input: CreatePostRequestBody!) {\n  createPost(input: $input) {\n    id\n  }\n}"): (typeof documents)["mutation CreatePost($input: CreatePostRequestBody!) {\n  createPost(input: $input) {\n    id\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateUser($input: CreateUserRequestBody!) {\n  createUser(input: $input) {\n    accessToken\n  }\n}"): (typeof documents)["mutation CreateUser($input: CreateUserRequestBody!) {\n  createUser(input: $input) {\n    accessToken\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Follow($input: CreateFollowshipRequestBody!) {\n  follow(input: $input)\n}"): (typeof documents)["mutation Follow($input: CreateFollowshipRequestBody!) {\n  follow(input: $input)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation GetPresignedPostImageURL {\n  getPresignedPostImageURL\n}"): (typeof documents)["mutation GetPresignedPostImageURL {\n  getPresignedPostImageURL\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Unfollow($input: DeleteFollowshipRequestBody!) {\n  unfollow(input: $input)\n}"): (typeof documents)["mutation Unfollow($input: DeleteFollowshipRequestBody!) {\n  unfollow(input: $input)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetFeed($input: GetFeedRequestBody!) {\n  getFeed(input: $input) {\n    count\n    posts {\n      id\n      imageURL\n      description\n      authorID\n      authorProfilePreview {\n        id\n        name\n        username\n      }\n    }\n  }\n}"): (typeof documents)["query GetFeed($input: GetFeedRequestBody!) {\n  getFeed(input: $input) {\n    count\n    posts {\n      id\n      imageURL\n      description\n      authorID\n      authorProfilePreview {\n        id\n        name\n        username\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetFollowees($input: GetFolloweesRequestBody!) {\n  getFollowees(input: $input) {\n    count\n    followees {\n      id\n      name\n      username\n    }\n  }\n}"): (typeof documents)["query GetFollowees($input: GetFolloweesRequestBody!) {\n  getFollowees(input: $input) {\n    count\n    followees {\n      id\n      name\n      username\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetFollowers($input: GetFollowersRequestBody!) {\n  getFollowers(input: $input) {\n    count\n    followers {\n      id\n      name\n      username\n    }\n  }\n}"): (typeof documents)["query GetFollowers($input: GetFollowersRequestBody!) {\n  getFollowers(input: $input) {\n    count\n    followers {\n      id\n      name\n      username\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetNotifications($input: GetNotificationsRequestBody!) {\n  getNotifications(input: $input) {\n    count\n    notifications {\n      _id\n      userID\n      kind\n      seen\n      createdAt\n    }\n  }\n}"): (typeof documents)["query GetNotifications($input: GetNotificationsRequestBody!) {\n  getNotifications(input: $input) {\n    count\n    notifications {\n      _id\n      userID\n      kind\n      seen\n      createdAt\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetPostsByAuthor($input: GetPostsByAuthorRequestBody!) {\n  getPostsByAuthor(input: $input) {\n    count\n    posts {\n      id\n      imageURL\n      description\n      authorID\n      authorProfilePreview {\n        id\n        name\n        username\n      }\n    }\n  }\n}"): (typeof documents)["query GetPostsByAuthor($input: GetPostsByAuthorRequestBody!) {\n  getPostsByAuthor(input: $input) {\n    count\n    posts {\n      id\n      imageURL\n      description\n      authorID\n      authorProfilePreview {\n        id\n        name\n        username\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Ping {\n  ping\n}"): (typeof documents)["query Ping {\n  ping\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query SearchProfiles($input: SearchProfilesRequestBody!) {\n  searchProfiles(input: $input) {\n    count\n    profilePreviews {\n      id\n      name\n      username\n    }\n  }\n}"): (typeof documents)["query SearchProfiles($input: SearchProfilesRequestBody!) {\n  searchProfiles(input: $input) {\n    count\n    profilePreviews {\n      id\n      name\n      username\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Signin($input: SigninInput!) {\n  signin(input: $input) {\n    accessToken\n  }\n}"): (typeof documents)["query Signin($input: SigninInput!) {\n  signin(input: $input) {\n    accessToken\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;