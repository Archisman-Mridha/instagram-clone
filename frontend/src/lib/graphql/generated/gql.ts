import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core"
/* eslint-disable */
import * as types from "./graphql"

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
  "fragment ProfilePreviewFragment on ProfilePreview {\n  id\n  name\n  username\n}": typeof types.ProfilePreviewFragmentFragmentDoc
  "fragment PostFragment on Post {\n  id\n  imageURL\n  description\n  authorProfilePreview {\n    ...ProfilePreviewFragment\n  }\n}": typeof types.PostFragmentFragmentDoc
  "mutation CreatePost($args: CreatePostArgs!) {\n  createPost(args: $args)\n}": typeof types.CreatePostDocument
  "mutation CreateUser($args: CreateUserArgs!) {\n  createUser(args: $args) {\n    accessToken\n    userID\n  }\n}": typeof types.CreateUserDocument
  "mutation Follow($args: CreateFollowshipArgs!) {\n  follow(args: $args)\n}": typeof types.FollowDocument
  "mutation GetPresignedPostImageURL {\n  getPresignedPostImageURL\n}": typeof types.GetPresignedPostImageUrlDocument
  "mutation Unfollow($args: DeleteFollowshipArgs!) {\n  unfollow(args: $args)\n}": typeof types.UnfollowDocument
  "query GetFeed($args: GetFeedArgs!) {\n  getFeed(args: $args) {\n    count\n    postIDs\n    posts {\n      ...PostFragment\n    }\n  }\n}": typeof types.GetFeedDocument
  "query GetFollowees($args: GetFolloweesArgs!) {\n  getFollowees(args: $args) {\n    count\n    followees {\n      id\n      profilePreview {\n        ...ProfilePreviewFragment\n      }\n    }\n  }\n}": typeof types.GetFolloweesDocument
  "query GetFollowers($args: GetFollowersArgs!) {\n  getFollowers(args: $args) {\n    count\n    followers {\n      id\n      profilePreview {\n        ...ProfilePreviewFragment\n      }\n    }\n  }\n}": typeof types.GetFollowersDocument
  "query GetPostByID($args: GetPostArgs!) {\n  getPostByID(args: $args) {\n    ...PostFragment\n  }\n}": typeof types.GetPostByIdDocument
  "query GetPostsByAuthor($args: GetPostsByAuthorArgs!) {\n  getPostsByAuthor(args: $args) {\n    count\n    posts {\n      ...PostFragment\n    }\n  }\n}": typeof types.GetPostsByAuthorDocument
  "query GetProfileByID($args: GetProfileByIDArgs!) {\n  getProfileByID(args: $args) {\n    id\n    name\n    username\n    bio\n    followshipCounts {\n      followeeCount\n      followerCount\n    }\n    isFollowee\n    posts {\n      ...PostFragment\n    }\n  }\n}": typeof types.GetProfileByIdDocument
  "query Ping {\n  ping\n}": typeof types.PingDocument
  "query SearchProfiles($args: SearchProfilesArgs!) {\n  searchProfiles(args: $args) {\n    count\n    profilePreviews {\n      ...ProfilePreviewFragment\n    }\n  }\n}": typeof types.SearchProfilesDocument
  "query Signin($args: SigninArgs!) {\n  signin(args: $args) {\n    accessToken\n    userID\n  }\n}": typeof types.SigninDocument
}
const documents: Documents = {
  "fragment ProfilePreviewFragment on ProfilePreview {\n  id\n  name\n  username\n}":
    types.ProfilePreviewFragmentFragmentDoc,
  "fragment PostFragment on Post {\n  id\n  imageURL\n  description\n  authorProfilePreview {\n    ...ProfilePreviewFragment\n  }\n}":
    types.PostFragmentFragmentDoc,
  "mutation CreatePost($args: CreatePostArgs!) {\n  createPost(args: $args)\n}":
    types.CreatePostDocument,
  "mutation CreateUser($args: CreateUserArgs!) {\n  createUser(args: $args) {\n    accessToken\n    userID\n  }\n}":
    types.CreateUserDocument,
  "mutation Follow($args: CreateFollowshipArgs!) {\n  follow(args: $args)\n}": types.FollowDocument,
  "mutation GetPresignedPostImageURL {\n  getPresignedPostImageURL\n}":
    types.GetPresignedPostImageUrlDocument,
  "mutation Unfollow($args: DeleteFollowshipArgs!) {\n  unfollow(args: $args)\n}":
    types.UnfollowDocument,
  "query GetFeed($args: GetFeedArgs!) {\n  getFeed(args: $args) {\n    count\n    postIDs\n    posts {\n      ...PostFragment\n    }\n  }\n}":
    types.GetFeedDocument,
  "query GetFollowees($args: GetFolloweesArgs!) {\n  getFollowees(args: $args) {\n    count\n    followees {\n      id\n      profilePreview {\n        ...ProfilePreviewFragment\n      }\n    }\n  }\n}":
    types.GetFolloweesDocument,
  "query GetFollowers($args: GetFollowersArgs!) {\n  getFollowers(args: $args) {\n    count\n    followers {\n      id\n      profilePreview {\n        ...ProfilePreviewFragment\n      }\n    }\n  }\n}":
    types.GetFollowersDocument,
  "query GetPostByID($args: GetPostArgs!) {\n  getPostByID(args: $args) {\n    ...PostFragment\n  }\n}":
    types.GetPostByIdDocument,
  "query GetPostsByAuthor($args: GetPostsByAuthorArgs!) {\n  getPostsByAuthor(args: $args) {\n    count\n    posts {\n      ...PostFragment\n    }\n  }\n}":
    types.GetPostsByAuthorDocument,
  "query GetProfileByID($args: GetProfileByIDArgs!) {\n  getProfileByID(args: $args) {\n    id\n    name\n    username\n    bio\n    followshipCounts {\n      followeeCount\n      followerCount\n    }\n    isFollowee\n    posts {\n      ...PostFragment\n    }\n  }\n}":
    types.GetProfileByIdDocument,
  "query Ping {\n  ping\n}": types.PingDocument,
  "query SearchProfiles($args: SearchProfilesArgs!) {\n  searchProfiles(args: $args) {\n    count\n    profilePreviews {\n      ...ProfilePreviewFragment\n    }\n  }\n}":
    types.SearchProfilesDocument,
  "query Signin($args: SigninArgs!) {\n  signin(args: $args) {\n    accessToken\n    userID\n  }\n}":
    types.SigninDocument
}

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
export function graphql(source: string): unknown

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "fragment ProfilePreviewFragment on ProfilePreview {\n  id\n  name\n  username\n}"
): (typeof documents)["fragment ProfilePreviewFragment on ProfilePreview {\n  id\n  name\n  username\n}"]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "fragment PostFragment on Post {\n  id\n  imageURL\n  description\n  authorProfilePreview {\n    ...ProfilePreviewFragment\n  }\n}"
): (typeof documents)["fragment PostFragment on Post {\n  id\n  imageURL\n  description\n  authorProfilePreview {\n    ...ProfilePreviewFragment\n  }\n}"]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation CreatePost($args: CreatePostArgs!) {\n  createPost(args: $args)\n}"
): (typeof documents)["mutation CreatePost($args: CreatePostArgs!) {\n  createPost(args: $args)\n}"]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation CreateUser($args: CreateUserArgs!) {\n  createUser(args: $args) {\n    accessToken\n    userID\n  }\n}"
): (typeof documents)["mutation CreateUser($args: CreateUserArgs!) {\n  createUser(args: $args) {\n    accessToken\n    userID\n  }\n}"]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation Follow($args: CreateFollowshipArgs!) {\n  follow(args: $args)\n}"
): (typeof documents)["mutation Follow($args: CreateFollowshipArgs!) {\n  follow(args: $args)\n}"]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation GetPresignedPostImageURL {\n  getPresignedPostImageURL\n}"
): (typeof documents)["mutation GetPresignedPostImageURL {\n  getPresignedPostImageURL\n}"]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "mutation Unfollow($args: DeleteFollowshipArgs!) {\n  unfollow(args: $args)\n}"
): (typeof documents)["mutation Unfollow($args: DeleteFollowshipArgs!) {\n  unfollow(args: $args)\n}"]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query GetFeed($args: GetFeedArgs!) {\n  getFeed(args: $args) {\n    count\n    postIDs\n    posts {\n      ...PostFragment\n    }\n  }\n}"
): (typeof documents)["query GetFeed($args: GetFeedArgs!) {\n  getFeed(args: $args) {\n    count\n    postIDs\n    posts {\n      ...PostFragment\n    }\n  }\n}"]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query GetFollowees($args: GetFolloweesArgs!) {\n  getFollowees(args: $args) {\n    count\n    followees {\n      id\n      profilePreview {\n        ...ProfilePreviewFragment\n      }\n    }\n  }\n}"
): (typeof documents)["query GetFollowees($args: GetFolloweesArgs!) {\n  getFollowees(args: $args) {\n    count\n    followees {\n      id\n      profilePreview {\n        ...ProfilePreviewFragment\n      }\n    }\n  }\n}"]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query GetFollowers($args: GetFollowersArgs!) {\n  getFollowers(args: $args) {\n    count\n    followers {\n      id\n      profilePreview {\n        ...ProfilePreviewFragment\n      }\n    }\n  }\n}"
): (typeof documents)["query GetFollowers($args: GetFollowersArgs!) {\n  getFollowers(args: $args) {\n    count\n    followers {\n      id\n      profilePreview {\n        ...ProfilePreviewFragment\n      }\n    }\n  }\n}"]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query GetPostByID($args: GetPostArgs!) {\n  getPostByID(args: $args) {\n    ...PostFragment\n  }\n}"
): (typeof documents)["query GetPostByID($args: GetPostArgs!) {\n  getPostByID(args: $args) {\n    ...PostFragment\n  }\n}"]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query GetPostsByAuthor($args: GetPostsByAuthorArgs!) {\n  getPostsByAuthor(args: $args) {\n    count\n    posts {\n      ...PostFragment\n    }\n  }\n}"
): (typeof documents)["query GetPostsByAuthor($args: GetPostsByAuthorArgs!) {\n  getPostsByAuthor(args: $args) {\n    count\n    posts {\n      ...PostFragment\n    }\n  }\n}"]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query GetProfileByID($args: GetProfileByIDArgs!) {\n  getProfileByID(args: $args) {\n    id\n    name\n    username\n    bio\n    followshipCounts {\n      followeeCount\n      followerCount\n    }\n    isFollowee\n    posts {\n      ...PostFragment\n    }\n  }\n}"
): (typeof documents)["query GetProfileByID($args: GetProfileByIDArgs!) {\n  getProfileByID(args: $args) {\n    id\n    name\n    username\n    bio\n    followshipCounts {\n      followeeCount\n      followerCount\n    }\n    isFollowee\n    posts {\n      ...PostFragment\n    }\n  }\n}"]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query Ping {\n  ping\n}"
): (typeof documents)["query Ping {\n  ping\n}"]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query SearchProfiles($args: SearchProfilesArgs!) {\n  searchProfiles(args: $args) {\n    count\n    profilePreviews {\n      ...ProfilePreviewFragment\n    }\n  }\n}"
): (typeof documents)["query SearchProfiles($args: SearchProfilesArgs!) {\n  searchProfiles(args: $args) {\n    count\n    profilePreviews {\n      ...ProfilePreviewFragment\n    }\n  }\n}"]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "query Signin($args: SigninArgs!) {\n  signin(args: $args) {\n    accessToken\n    userID\n  }\n}"
): (typeof documents)["query Signin($args: SigninArgs!) {\n  signin(args: $args) {\n    accessToken\n    userID\n  }\n}"]

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
