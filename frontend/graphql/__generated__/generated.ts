import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import { graphql } from 'msw'
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuthenticationOutput = {
  __typename?: 'AuthenticationOutput';
  jwt: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
};

export type CreatePostArgs = {
  description: Scalars['String']['input'];
};

export type GetFeedArgs = {
  offset: Scalars['Int']['input'];
  pageSize?: Scalars['Int']['input'];
};

export type GetFollowersArgs = {
  offset: Scalars['Int']['input'];
  pageSize?: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};

export type GetFollowingsArgs = {
  offset: Scalars['Int']['input'];
  pageSize?: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};

export type GetPostsOfUserArgs = {
  offset: Scalars['Int']['input'];
  pageSize?: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};

export type GetProfileArgs = {
  maxRecentPostCount?: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Scalars['Int']['output'];
  follow?: Maybe<Scalars['Boolean']['output']>;
  signup: AuthenticationOutput;
  unfollow?: Maybe<Scalars['Boolean']['output']>;
};


export type MutationCreatePostArgs = {
  args: CreatePostArgs;
};


export type MutationFollowArgs = {
  followeeId: Scalars['Int']['input'];
};


export type MutationSignupArgs = {
  args: SignupArgs;
};


export type MutationUnfollowArgs = {
  followeeId: Scalars['Int']['input'];
};

export type Post = {
  __typename?: 'Post';
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  ownerId: Scalars['Int']['output'];
};

export type Profile = {
  __typename?: 'Profile';
  followerCount: Scalars['Int']['output'];
  followingCount: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  isFollowee: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  profilePictureUri?: Maybe<Scalars['String']['output']>;
  recentPosts: Array<Maybe<Post>>;
  username: Scalars['String']['output'];
};

export type ProfilePreview = {
  __typename?: 'ProfilePreview';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  profilePictureUri?: Maybe<Scalars['String']['output']>;
  username: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  getFeed: Array<Maybe<Post>>;
  getFollowers: Array<Maybe<ProfilePreview>>;
  getFollowings: Array<Maybe<ProfilePreview>>;
  getPostsOfUser: Array<Maybe<Post>>;
  getProfile?: Maybe<Profile>;
  searchProfiles: SearchProfilesOutput;
  signin: AuthenticationOutput;
};


export type QueryGetFeedArgs = {
  args: GetFeedArgs;
};


export type QueryGetFollowersArgs = {
  args: GetFollowersArgs;
};


export type QueryGetFollowingsArgs = {
  args: GetFollowingsArgs;
};


export type QueryGetPostsOfUserArgs = {
  args: GetPostsOfUserArgs;
};


export type QueryGetProfileArgs = {
  args: GetProfileArgs;
};


export type QuerySearchProfilesArgs = {
  args: SearchProfilesArgs;
};


export type QuerySigninArgs = {
  args: SigninArgs;
};

export type SearchProfilesArgs = {
  query: Scalars['String']['input'];
};

export type SearchProfilesOutput = {
  __typename?: 'SearchProfilesOutput';
  profilePreviews: Array<Maybe<ProfilePreview>>;
};

export type SigninArgs = {
  identifier: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignupArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type FollowMutationVariables = Exact<{
  followeeId: Scalars['Int']['input'];
}>;


export type FollowMutation = { __typename?: 'Mutation', follow?: boolean | null };

export type GetFeedQueryVariables = Exact<{
  args: GetFeedArgs;
}>;


export type GetFeedQuery = { __typename?: 'Query', getFeed: Array<{ __typename?: 'Post', id: number, ownerId: number, description: string, createdAt: string } | null> };

export type GetFollowersQueryVariables = Exact<{
  args: GetFollowersArgs;
}>;


export type GetFollowersQuery = { __typename?: 'Query', getFollowers: Array<{ __typename?: 'ProfilePreview', id: number, name: string, username: string, profilePictureUri?: string | null } | null> };

export type GetFollowingsQueryVariables = Exact<{
  args: GetFollowingsArgs;
}>;


export type GetFollowingsQuery = { __typename?: 'Query', getFollowings: Array<{ __typename?: 'ProfilePreview', id: number, name: string, username: string, profilePictureUri?: string | null } | null> };

export type GetPostsOfUserQueryVariables = Exact<{
  args: GetPostsOfUserArgs;
}>;


export type GetPostsOfUserQuery = { __typename?: 'Query', getPostsOfUser: Array<{ __typename?: 'Post', id: number, ownerId: number, description: string, createdAt: string } | null> };

export type GetProfileQueryVariables = Exact<{
  args: GetProfileArgs;
}>;


export type GetProfileQuery = { __typename?: 'Query', getProfile?: { __typename?: 'Profile', name: string, username: string, profilePictureUri?: string | null, followerCount: number, followingCount: number, isFollowee: boolean, recentPosts: Array<{ __typename?: 'Post', id: number, description: string, createdAt: string } | null> } | null };

export type SearchProfilesQueryVariables = Exact<{
  args: SearchProfilesArgs;
}>;


export type SearchProfilesQuery = { __typename?: 'Query', searchProfiles: { __typename?: 'SearchProfilesOutput', profilePreviews: Array<{ __typename?: 'ProfilePreview', id: number, name: string, username: string, profilePictureUri?: string | null } | null> } };

export type SigninQueryVariables = Exact<{
  args: SigninArgs;
}>;


export type SigninQuery = { __typename?: 'Query', signin: { __typename?: 'AuthenticationOutput', userId: number, jwt: string } };

export type SignupMutationVariables = Exact<{
  args: SignupArgs;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'AuthenticationOutput', userId: number, jwt: string } };

export type UnfollowMutationVariables = Exact<{
  followeeId: Scalars['Int']['input'];
}>;


export type UnfollowMutation = { __typename?: 'Mutation', unfollow?: boolean | null };


export const FollowDocument = gql`
    mutation Follow($followeeId: Int!) {
  follow(followeeId: $followeeId)
}
    `;
export type FollowMutationFn = Apollo.MutationFunction<FollowMutation, FollowMutationVariables>;

/**
 * __useFollowMutation__
 *
 * To run a mutation, you first call `useFollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [followMutation, { data, loading, error }] = useFollowMutation({
 *   variables: {
 *      followeeId: // value for 'followeeId'
 *   },
 * });
 */
export function useFollowMutation(baseOptions?: Apollo.MutationHookOptions<FollowMutation, FollowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<FollowMutation, FollowMutationVariables>(FollowDocument, options);
      }
export type FollowMutationHookResult = ReturnType<typeof useFollowMutation>;
export type FollowMutationResult = Apollo.MutationResult<FollowMutation>;
export type FollowMutationOptions = Apollo.BaseMutationOptions<FollowMutation, FollowMutationVariables>;
export const GetFeedDocument = gql`
    query GetFeed($args: GetFeedArgs!) {
  getFeed(args: $args) {
    id
    ownerId
    description
    createdAt
  }
}
    `;

/**
 * __useGetFeedQuery__
 *
 * To run a query within a React component, call `useGetFeedQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFeedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFeedQuery({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useGetFeedQuery(baseOptions: Apollo.QueryHookOptions<GetFeedQuery, GetFeedQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFeedQuery, GetFeedQueryVariables>(GetFeedDocument, options);
      }
export function useGetFeedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFeedQuery, GetFeedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFeedQuery, GetFeedQueryVariables>(GetFeedDocument, options);
        }
export function useGetFeedSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetFeedQuery, GetFeedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFeedQuery, GetFeedQueryVariables>(GetFeedDocument, options);
        }
export type GetFeedQueryHookResult = ReturnType<typeof useGetFeedQuery>;
export type GetFeedLazyQueryHookResult = ReturnType<typeof useGetFeedLazyQuery>;
export type GetFeedSuspenseQueryHookResult = ReturnType<typeof useGetFeedSuspenseQuery>;
export type GetFeedQueryResult = Apollo.QueryResult<GetFeedQuery, GetFeedQueryVariables>;
export const GetFollowersDocument = gql`
    query GetFollowers($args: GetFollowersArgs!) {
  getFollowers(args: $args) {
    id
    name
    username
    profilePictureUri
  }
}
    `;

/**
 * __useGetFollowersQuery__
 *
 * To run a query within a React component, call `useGetFollowersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowersQuery({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useGetFollowersQuery(baseOptions: Apollo.QueryHookOptions<GetFollowersQuery, GetFollowersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowersDocument, options);
      }
export function useGetFollowersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFollowersQuery, GetFollowersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowersDocument, options);
        }
export function useGetFollowersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetFollowersQuery, GetFollowersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowersDocument, options);
        }
export type GetFollowersQueryHookResult = ReturnType<typeof useGetFollowersQuery>;
export type GetFollowersLazyQueryHookResult = ReturnType<typeof useGetFollowersLazyQuery>;
export type GetFollowersSuspenseQueryHookResult = ReturnType<typeof useGetFollowersSuspenseQuery>;
export type GetFollowersQueryResult = Apollo.QueryResult<GetFollowersQuery, GetFollowersQueryVariables>;
export const GetFollowingsDocument = gql`
    query GetFollowings($args: GetFollowingsArgs!) {
  getFollowings(args: $args) {
    id
    name
    username
    profilePictureUri
  }
}
    `;

/**
 * __useGetFollowingsQuery__
 *
 * To run a query within a React component, call `useGetFollowingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowingsQuery({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useGetFollowingsQuery(baseOptions: Apollo.QueryHookOptions<GetFollowingsQuery, GetFollowingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFollowingsQuery, GetFollowingsQueryVariables>(GetFollowingsDocument, options);
      }
export function useGetFollowingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFollowingsQuery, GetFollowingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFollowingsQuery, GetFollowingsQueryVariables>(GetFollowingsDocument, options);
        }
export function useGetFollowingsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetFollowingsQuery, GetFollowingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFollowingsQuery, GetFollowingsQueryVariables>(GetFollowingsDocument, options);
        }
export type GetFollowingsQueryHookResult = ReturnType<typeof useGetFollowingsQuery>;
export type GetFollowingsLazyQueryHookResult = ReturnType<typeof useGetFollowingsLazyQuery>;
export type GetFollowingsSuspenseQueryHookResult = ReturnType<typeof useGetFollowingsSuspenseQuery>;
export type GetFollowingsQueryResult = Apollo.QueryResult<GetFollowingsQuery, GetFollowingsQueryVariables>;
export const GetPostsOfUserDocument = gql`
    query GetPostsOfUser($args: GetPostsOfUserArgs!) {
  getPostsOfUser(args: $args) {
    id
    ownerId
    description
    createdAt
  }
}
    `;

/**
 * __useGetPostsOfUserQuery__
 *
 * To run a query within a React component, call `useGetPostsOfUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostsOfUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostsOfUserQuery({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useGetPostsOfUserQuery(baseOptions: Apollo.QueryHookOptions<GetPostsOfUserQuery, GetPostsOfUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPostsOfUserQuery, GetPostsOfUserQueryVariables>(GetPostsOfUserDocument, options);
      }
export function useGetPostsOfUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPostsOfUserQuery, GetPostsOfUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPostsOfUserQuery, GetPostsOfUserQueryVariables>(GetPostsOfUserDocument, options);
        }
export function useGetPostsOfUserSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetPostsOfUserQuery, GetPostsOfUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPostsOfUserQuery, GetPostsOfUserQueryVariables>(GetPostsOfUserDocument, options);
        }
export type GetPostsOfUserQueryHookResult = ReturnType<typeof useGetPostsOfUserQuery>;
export type GetPostsOfUserLazyQueryHookResult = ReturnType<typeof useGetPostsOfUserLazyQuery>;
export type GetPostsOfUserSuspenseQueryHookResult = ReturnType<typeof useGetPostsOfUserSuspenseQuery>;
export type GetPostsOfUserQueryResult = Apollo.QueryResult<GetPostsOfUserQuery, GetPostsOfUserQueryVariables>;
export const GetProfileDocument = gql`
    query GetProfile($args: GetProfileArgs!) {
  getProfile(args: $args) {
    name
    username
    profilePictureUri
    followerCount
    followingCount
    isFollowee
    recentPosts {
      id
      description
      createdAt
    }
  }
}
    `;

/**
 * __useGetProfileQuery__
 *
 * To run a query within a React component, call `useGetProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileQuery({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useGetProfileQuery(baseOptions: Apollo.QueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
      }
export function useGetProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
        }
export function useGetProfileSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
        }
export type GetProfileQueryHookResult = ReturnType<typeof useGetProfileQuery>;
export type GetProfileLazyQueryHookResult = ReturnType<typeof useGetProfileLazyQuery>;
export type GetProfileSuspenseQueryHookResult = ReturnType<typeof useGetProfileSuspenseQuery>;
export type GetProfileQueryResult = Apollo.QueryResult<GetProfileQuery, GetProfileQueryVariables>;
export const SearchProfilesDocument = gql`
    query SearchProfiles($args: SearchProfilesArgs!) {
  searchProfiles(args: $args) {
    profilePreviews {
      id
      name
      username
      profilePictureUri
    }
  }
}
    `;

/**
 * __useSearchProfilesQuery__
 *
 * To run a query within a React component, call `useSearchProfilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchProfilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchProfilesQuery({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useSearchProfilesQuery(baseOptions: Apollo.QueryHookOptions<SearchProfilesQuery, SearchProfilesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchProfilesQuery, SearchProfilesQueryVariables>(SearchProfilesDocument, options);
      }
export function useSearchProfilesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchProfilesQuery, SearchProfilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchProfilesQuery, SearchProfilesQueryVariables>(SearchProfilesDocument, options);
        }
export function useSearchProfilesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SearchProfilesQuery, SearchProfilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchProfilesQuery, SearchProfilesQueryVariables>(SearchProfilesDocument, options);
        }
export type SearchProfilesQueryHookResult = ReturnType<typeof useSearchProfilesQuery>;
export type SearchProfilesLazyQueryHookResult = ReturnType<typeof useSearchProfilesLazyQuery>;
export type SearchProfilesSuspenseQueryHookResult = ReturnType<typeof useSearchProfilesSuspenseQuery>;
export type SearchProfilesQueryResult = Apollo.QueryResult<SearchProfilesQuery, SearchProfilesQueryVariables>;
export const SigninDocument = gql`
    query Signin($args: SigninArgs!) {
  signin(args: $args) {
    userId
    jwt
  }
}
    `;

/**
 * __useSigninQuery__
 *
 * To run a query within a React component, call `useSigninQuery` and pass it any options that fit your needs.
 * When your component renders, `useSigninQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSigninQuery({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useSigninQuery(baseOptions: Apollo.QueryHookOptions<SigninQuery, SigninQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SigninQuery, SigninQueryVariables>(SigninDocument, options);
      }
export function useSigninLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SigninQuery, SigninQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SigninQuery, SigninQueryVariables>(SigninDocument, options);
        }
export function useSigninSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SigninQuery, SigninQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SigninQuery, SigninQueryVariables>(SigninDocument, options);
        }
export type SigninQueryHookResult = ReturnType<typeof useSigninQuery>;
export type SigninLazyQueryHookResult = ReturnType<typeof useSigninLazyQuery>;
export type SigninSuspenseQueryHookResult = ReturnType<typeof useSigninSuspenseQuery>;
export type SigninQueryResult = Apollo.QueryResult<SigninQuery, SigninQueryVariables>;
export const SignupDocument = gql`
    mutation Signup($args: SignupArgs!) {
  signup(args: $args) {
    userId
    jwt
  }
}
    `;
export type SignupMutationFn = Apollo.MutationFunction<SignupMutation, SignupMutationVariables>;

/**
 * __useSignupMutation__
 *
 * To run a mutation, you first call `useSignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signupMutation, { data, loading, error }] = useSignupMutation({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useSignupMutation(baseOptions?: Apollo.MutationHookOptions<SignupMutation, SignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignupMutation, SignupMutationVariables>(SignupDocument, options);
      }
export type SignupMutationHookResult = ReturnType<typeof useSignupMutation>;
export type SignupMutationResult = Apollo.MutationResult<SignupMutation>;
export type SignupMutationOptions = Apollo.BaseMutationOptions<SignupMutation, SignupMutationVariables>;
export const UnfollowDocument = gql`
    mutation Unfollow($followeeId: Int!) {
  unfollow(followeeId: $followeeId)
}
    `;
export type UnfollowMutationFn = Apollo.MutationFunction<UnfollowMutation, UnfollowMutationVariables>;

/**
 * __useUnfollowMutation__
 *
 * To run a mutation, you first call `useUnfollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnfollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unfollowMutation, { data, loading, error }] = useUnfollowMutation({
 *   variables: {
 *      followeeId: // value for 'followeeId'
 *   },
 * });
 */
export function useUnfollowMutation(baseOptions?: Apollo.MutationHookOptions<UnfollowMutation, UnfollowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnfollowMutation, UnfollowMutationVariables>(UnfollowDocument, options);
      }
export type UnfollowMutationHookResult = ReturnType<typeof useUnfollowMutation>;
export type UnfollowMutationResult = Apollo.MutationResult<UnfollowMutation>;
export type UnfollowMutationOptions = Apollo.BaseMutationOptions<UnfollowMutation, UnfollowMutationVariables>;

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockFollowMutation((req, res, ctx) => {
 *   const { followeeId } = req.variables;
 *   return res(
 *     ctx.data({ follow })
 *   )
 * })
 */
export const mockFollowMutation = (resolver: Parameters<typeof graphql.mutation<FollowMutation, FollowMutationVariables>>[1]) =>
  graphql.mutation<FollowMutation, FollowMutationVariables>(
    'Follow',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetFeedQuery((req, res, ctx) => {
 *   const { args } = req.variables;
 *   return res(
 *     ctx.data({ getFeed })
 *   )
 * })
 */
export const mockGetFeedQuery = (resolver: Parameters<typeof graphql.query<GetFeedQuery, GetFeedQueryVariables>>[1]) =>
  graphql.query<GetFeedQuery, GetFeedQueryVariables>(
    'GetFeed',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetFollowersQuery((req, res, ctx) => {
 *   const { args } = req.variables;
 *   return res(
 *     ctx.data({ getFollowers })
 *   )
 * })
 */
export const mockGetFollowersQuery = (resolver: Parameters<typeof graphql.query<GetFollowersQuery, GetFollowersQueryVariables>>[1]) =>
  graphql.query<GetFollowersQuery, GetFollowersQueryVariables>(
    'GetFollowers',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetFollowingsQuery((req, res, ctx) => {
 *   const { args } = req.variables;
 *   return res(
 *     ctx.data({ getFollowings })
 *   )
 * })
 */
export const mockGetFollowingsQuery = (resolver: Parameters<typeof graphql.query<GetFollowingsQuery, GetFollowingsQueryVariables>>[1]) =>
  graphql.query<GetFollowingsQuery, GetFollowingsQueryVariables>(
    'GetFollowings',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetPostsOfUserQuery((req, res, ctx) => {
 *   const { args } = req.variables;
 *   return res(
 *     ctx.data({ getPostsOfUser })
 *   )
 * })
 */
export const mockGetPostsOfUserQuery = (resolver: Parameters<typeof graphql.query<GetPostsOfUserQuery, GetPostsOfUserQueryVariables>>[1]) =>
  graphql.query<GetPostsOfUserQuery, GetPostsOfUserQueryVariables>(
    'GetPostsOfUser',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetProfileQuery((req, res, ctx) => {
 *   const { args } = req.variables;
 *   return res(
 *     ctx.data({ getProfile })
 *   )
 * })
 */
export const mockGetProfileQuery = (resolver: Parameters<typeof graphql.query<GetProfileQuery, GetProfileQueryVariables>>[1]) =>
  graphql.query<GetProfileQuery, GetProfileQueryVariables>(
    'GetProfile',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockSearchProfilesQuery((req, res, ctx) => {
 *   const { args } = req.variables;
 *   return res(
 *     ctx.data({ searchProfiles })
 *   )
 * })
 */
export const mockSearchProfilesQuery = (resolver: Parameters<typeof graphql.query<SearchProfilesQuery, SearchProfilesQueryVariables>>[1]) =>
  graphql.query<SearchProfilesQuery, SearchProfilesQueryVariables>(
    'SearchProfiles',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockSigninQuery((req, res, ctx) => {
 *   const { args } = req.variables;
 *   return res(
 *     ctx.data({ signin })
 *   )
 * })
 */
export const mockSigninQuery = (resolver: Parameters<typeof graphql.query<SigninQuery, SigninQueryVariables>>[1]) =>
  graphql.query<SigninQuery, SigninQueryVariables>(
    'Signin',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockSignupMutation((req, res, ctx) => {
 *   const { args } = req.variables;
 *   return res(
 *     ctx.data({ signup })
 *   )
 * })
 */
export const mockSignupMutation = (resolver: Parameters<typeof graphql.mutation<SignupMutation, SignupMutationVariables>>[1]) =>
  graphql.mutation<SignupMutation, SignupMutationVariables>(
    'Signup',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUnfollowMutation((req, res, ctx) => {
 *   const { followeeId } = req.variables;
 *   return res(
 *     ctx.data({ unfollow })
 *   )
 * })
 */
export const mockUnfollowMutation = (resolver: Parameters<typeof graphql.mutation<UnfollowMutation, UnfollowMutationVariables>>[1]) =>
  graphql.mutation<UnfollowMutation, UnfollowMutationVariables>(
    'Unfollow',
    resolver
  )
