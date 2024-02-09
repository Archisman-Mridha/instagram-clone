// This file was generated with `cornucopia`. Do not modify.

#[allow(clippy :: all, clippy :: pedantic)] #[allow(unused_variables)]
#[allow(unused_imports)] #[allow(dead_code)] pub mod types { }#[allow(clippy :: all, clippy :: pedantic)] #[allow(unused_variables)]
#[allow(unused_imports)] #[allow(dead_code)] pub mod queries
{ pub mod feeds_microservice
{ use futures::{{StreamExt, TryStreamExt}};use futures; use cornucopia_async::GenericClient;pub struct I32Query < 'a, C : GenericClient, T, const N : usize >
{
    client : & 'a  C, params :
    [& 'a (dyn postgres_types :: ToSql + Sync) ; N], stmt : & 'a mut cornucopia_async
    :: private :: Stmt, extractor : fn(& tokio_postgres :: Row) -> i32,
    mapper : fn(i32) -> T,
} impl < 'a, C, T : 'a, const N : usize > I32Query < 'a, C, T, N >
where C : GenericClient
{
    pub fn map < R > (self, mapper : fn(i32) -> R) -> I32Query
    < 'a, C, R, N >
    {
        I32Query
        {
            client : self.client, params : self.params, stmt : self.stmt,
            extractor : self.extractor, mapper,
        }
    } pub async fn one(self) -> Result < T, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let row =
        self.client.query_one(stmt, & self.params) .await ? ;
        Ok((self.mapper) ((self.extractor) (& row)))
    } pub async fn all(self) -> Result < Vec < T >, tokio_postgres :: Error >
    { self.iter() .await ?.try_collect().await } pub async fn opt(self) -> Result
    < Option < T >, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ;
        Ok(self.client.query_opt(stmt, & self.params) .await
        ?.map(| row | (self.mapper) ((self.extractor) (& row))))
    } pub async fn iter(self,) -> Result < impl futures::Stream < Item = Result
    < T, tokio_postgres :: Error >> + 'a, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let it =
        self.client.query_raw(stmt, cornucopia_async :: private ::
        slice_iter(& self.params)) .await ?
        .map(move | res |
        res.map(| row | (self.mapper) ((self.extractor) (& row)))) .into_stream() ;
        Ok(it)
    }
}pub fn getAllFollowers() -> GetAllFollowersStmt
{ GetAllFollowersStmt(cornucopia_async :: private :: Stmt :: new("SELECT follower_id FROM followships
	WHERE followee_id= $1")) } pub
struct GetAllFollowersStmt(cornucopia_async :: private :: Stmt) ; impl
GetAllFollowersStmt { pub fn bind < 'a, C : GenericClient, >
(& 'a mut self, client : & 'a  C,
userId : & 'a i32,) -> I32Query < 'a, C,
i32, 1 >
{
    I32Query
    {
        client, params : [userId,], stmt : & mut self.0, extractor :
        | row | { row.get(0) }, mapper : | it | { it },
    }
} }}pub mod followships_microservice
{ use futures::{{StreamExt, TryStreamExt}};use futures; use cornucopia_async::GenericClient;#[derive(Clone,Copy, Debug)] pub struct CreateParams < > { pub followerId : i32,pub followeeId : i32,}#[derive(Clone,Copy, Debug)] pub struct DeleteParams < > { pub followerId : i32,pub followeeId : i32,}#[derive(Clone,Copy, Debug)] pub struct ExistsParams < > { pub followerId : i32,pub followeeId : i32,}#[derive(Clone,Copy, Debug)] pub struct GetFollowersParams < > { pub userId : i32,pub pageSize : i64,pub offset : i64,}#[derive(Clone,Copy, Debug)] pub struct GetFollowingsParams < > { pub userId : i32,pub pageSize : i64,pub offset : i64,}pub struct I32Query < 'a, C : GenericClient, T, const N : usize >
{
    client : & 'a  C, params :
    [& 'a (dyn postgres_types :: ToSql + Sync) ; N], stmt : & 'a mut cornucopia_async
    :: private :: Stmt, extractor : fn(& tokio_postgres :: Row) -> i32,
    mapper : fn(i32) -> T,
} impl < 'a, C, T : 'a, const N : usize > I32Query < 'a, C, T, N >
where C : GenericClient
{
    pub fn map < R > (self, mapper : fn(i32) -> R) -> I32Query
    < 'a, C, R, N >
    {
        I32Query
        {
            client : self.client, params : self.params, stmt : self.stmt,
            extractor : self.extractor, mapper,
        }
    } pub async fn one(self) -> Result < T, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let row =
        self.client.query_one(stmt, & self.params) .await ? ;
        Ok((self.mapper) ((self.extractor) (& row)))
    } pub async fn all(self) -> Result < Vec < T >, tokio_postgres :: Error >
    { self.iter() .await ?.try_collect().await } pub async fn opt(self) -> Result
    < Option < T >, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ;
        Ok(self.client.query_opt(stmt, & self.params) .await
        ?.map(| row | (self.mapper) ((self.extractor) (& row))))
    } pub async fn iter(self,) -> Result < impl futures::Stream < Item = Result
    < T, tokio_postgres :: Error >> + 'a, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let it =
        self.client.query_raw(stmt, cornucopia_async :: private ::
        slice_iter(& self.params)) .await ?
        .map(move | res |
        res.map(| row | (self.mapper) ((self.extractor) (& row)))) .into_stream() ;
        Ok(it)
    }
}#[derive( Debug, Clone, PartialEq, Copy)] pub struct GetFollowshipCounts
{ pub follower_count : i64,pub following_count : i64,}pub struct GetFollowshipCountsQuery < 'a, C : GenericClient, T, const N : usize >
{
    client : & 'a  C, params :
    [& 'a (dyn postgres_types :: ToSql + Sync) ; N], stmt : & 'a mut cornucopia_async
    :: private :: Stmt, extractor : fn(& tokio_postgres :: Row) -> GetFollowshipCounts,
    mapper : fn(GetFollowshipCounts) -> T,
} impl < 'a, C, T : 'a, const N : usize > GetFollowshipCountsQuery < 'a, C, T, N >
where C : GenericClient
{
    pub fn map < R > (self, mapper : fn(GetFollowshipCounts) -> R) -> GetFollowshipCountsQuery
    < 'a, C, R, N >
    {
        GetFollowshipCountsQuery
        {
            client : self.client, params : self.params, stmt : self.stmt,
            extractor : self.extractor, mapper,
        }
    } pub async fn one(self) -> Result < T, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let row =
        self.client.query_one(stmt, & self.params) .await ? ;
        Ok((self.mapper) ((self.extractor) (& row)))
    } pub async fn all(self) -> Result < Vec < T >, tokio_postgres :: Error >
    { self.iter() .await ?.try_collect().await } pub async fn opt(self) -> Result
    < Option < T >, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ;
        Ok(self.client.query_opt(stmt, & self.params) .await
        ?.map(| row | (self.mapper) ((self.extractor) (& row))))
    } pub async fn iter(self,) -> Result < impl futures::Stream < Item = Result
    < T, tokio_postgres :: Error >> + 'a, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let it =
        self.client.query_raw(stmt, cornucopia_async :: private ::
        slice_iter(& self.params)) .await ?
        .map(move | res |
        res.map(| row | (self.mapper) ((self.extractor) (& row)))) .into_stream() ;
        Ok(it)
    }
}pub fn create() -> CreateStmt
{ CreateStmt(cornucopia_async :: private :: Stmt :: new("INSERT INTO followships
	(follower_id, followee_id)
	VALUES ($1, $2)")) } pub
struct CreateStmt(cornucopia_async :: private :: Stmt) ; impl
CreateStmt { pub async fn bind < 'a, C : GenericClient, >
(& 'a mut self, client : & 'a  C,
followerId : & 'a i32,followeeId : & 'a i32,) -> Result < u64, tokio_postgres :: Error >
{
    let stmt = self.0.prepare(client) .await ? ;
    client.execute(stmt, & [followerId,followeeId,]) .await
} }impl < 'a, C : GenericClient + Send + Sync, >
cornucopia_async :: Params < 'a, CreateParams < >, std::pin::Pin<Box<dyn futures::Future<Output = Result <
u64, tokio_postgres :: Error > > + Send + 'a>>, C > for CreateStmt
{
    fn
    params(& 'a mut self, client : & 'a  C, params : & 'a
    CreateParams < >) -> std::pin::Pin<Box<dyn futures::Future<Output = Result < u64, tokio_postgres ::
    Error > > + Send + 'a>> { Box::pin(self.bind(client, & params.followerId,& params.followeeId,) ) }
}pub fn delete() -> DeleteStmt
{ DeleteStmt(cornucopia_async :: private :: Stmt :: new("DELETE FROM followships
	WHERE follower_id= $1 AND followee_id= $2")) } pub
struct DeleteStmt(cornucopia_async :: private :: Stmt) ; impl
DeleteStmt { pub async fn bind < 'a, C : GenericClient, >
(& 'a mut self, client : & 'a  C,
followerId : & 'a i32,followeeId : & 'a i32,) -> Result < u64, tokio_postgres :: Error >
{
    let stmt = self.0.prepare(client) .await ? ;
    client.execute(stmt, & [followerId,followeeId,]) .await
} }impl < 'a, C : GenericClient + Send + Sync, >
cornucopia_async :: Params < 'a, DeleteParams < >, std::pin::Pin<Box<dyn futures::Future<Output = Result <
u64, tokio_postgres :: Error > > + Send + 'a>>, C > for DeleteStmt
{
    fn
    params(& 'a mut self, client : & 'a  C, params : & 'a
    DeleteParams < >) -> std::pin::Pin<Box<dyn futures::Future<Output = Result < u64, tokio_postgres ::
    Error > > + Send + 'a>> { Box::pin(self.bind(client, & params.followerId,& params.followeeId,) ) }
}pub fn exists() -> ExistsStmt
{ ExistsStmt(cornucopia_async :: private :: Stmt :: new("SELECT 1 FROM followships
	WHERE follower_id= $1 AND followee_id= $2
	LIMIT 1")) } pub
struct ExistsStmt(cornucopia_async :: private :: Stmt) ; impl
ExistsStmt { pub fn bind < 'a, C : GenericClient, >
(& 'a mut self, client : & 'a  C,
followerId : & 'a i32,followeeId : & 'a i32,) -> I32Query < 'a, C,
i32, 2 >
{
    I32Query
    {
        client, params : [followerId,followeeId,], stmt : & mut self.0, extractor :
        | row | { row.get(0) }, mapper : | it | { it },
    }
} }impl < 'a, C : GenericClient, > cornucopia_async ::
Params < 'a, ExistsParams < >, I32Query < 'a,
C, i32, 2 >, C > for ExistsStmt
{
    fn
    params(& 'a mut self, client : & 'a  C, params : & 'a
    ExistsParams < >) -> I32Query < 'a, C,
    i32, 2 >
    { self.bind(client, & params.followerId,& params.followeeId,) }
}pub fn getFollowers() -> GetFollowersStmt
{ GetFollowersStmt(cornucopia_async :: private :: Stmt :: new("SELECT follower_id FROM followships
	WHERE followee_id= $1
	LIMIT $2 OFFSET $3")) } pub
struct GetFollowersStmt(cornucopia_async :: private :: Stmt) ; impl
GetFollowersStmt { pub fn bind < 'a, C : GenericClient, >
(& 'a mut self, client : & 'a  C,
userId : & 'a i32,pageSize : & 'a i64,offset : & 'a i64,) -> I32Query < 'a, C,
i32, 3 >
{
    I32Query
    {
        client, params : [userId,pageSize,offset,], stmt : & mut self.0, extractor :
        | row | { row.get(0) }, mapper : | it | { it },
    }
} }impl < 'a, C : GenericClient, > cornucopia_async ::
Params < 'a, GetFollowersParams < >, I32Query < 'a,
C, i32, 3 >, C > for GetFollowersStmt
{
    fn
    params(& 'a mut self, client : & 'a  C, params : & 'a
    GetFollowersParams < >) -> I32Query < 'a, C,
    i32, 3 >
    { self.bind(client, & params.userId,& params.pageSize,& params.offset,) }
}pub fn getFollowings() -> GetFollowingsStmt
{ GetFollowingsStmt(cornucopia_async :: private :: Stmt :: new("SELECT followee_id FROM followships
	WHERE follower_id= $1
	LIMIT $2 OFFSET $3")) } pub
struct GetFollowingsStmt(cornucopia_async :: private :: Stmt) ; impl
GetFollowingsStmt { pub fn bind < 'a, C : GenericClient, >
(& 'a mut self, client : & 'a  C,
userId : & 'a i32,pageSize : & 'a i64,offset : & 'a i64,) -> I32Query < 'a, C,
i32, 3 >
{
    I32Query
    {
        client, params : [userId,pageSize,offset,], stmt : & mut self.0, extractor :
        | row | { row.get(0) }, mapper : | it | { it },
    }
} }impl < 'a, C : GenericClient, > cornucopia_async ::
Params < 'a, GetFollowingsParams < >, I32Query < 'a,
C, i32, 3 >, C > for GetFollowingsStmt
{
    fn
    params(& 'a mut self, client : & 'a  C, params : & 'a
    GetFollowingsParams < >) -> I32Query < 'a, C,
    i32, 3 >
    { self.bind(client, & params.userId,& params.pageSize,& params.offset,) }
}pub fn getFollowshipCounts() -> GetFollowshipCountsStmt
{ GetFollowshipCountsStmt(cornucopia_async :: private :: Stmt :: new("SELECT
	(SELECT COUNT(*) FROM followships WHERE followee_id = $1) AS follower_count,
	(SELECT COUNT(*) FROM followships WHERE follower_id = $1) AS following_count")) } pub
struct GetFollowshipCountsStmt(cornucopia_async :: private :: Stmt) ; impl
GetFollowshipCountsStmt { pub fn bind < 'a, C : GenericClient, >
(& 'a mut self, client : & 'a  C,
userId : & 'a i32,) -> GetFollowshipCountsQuery < 'a, C,
GetFollowshipCounts, 1 >
{
    GetFollowshipCountsQuery
    {
        client, params : [userId,], stmt : & mut self.0, extractor :
        | row | { GetFollowshipCounts { follower_count : row.get(0),following_count : row.get(1),} }, mapper : | it | { <GetFollowshipCounts>::from(it) },
    }
} }}pub mod posts_microservice
{ use futures::{{StreamExt, TryStreamExt}};use futures; use cornucopia_async::GenericClient;#[derive( Debug)] pub struct CreateParams < T1 : cornucopia_async::StringSql,> { pub owner_id : i32,pub description : T1,}#[derive(Clone,Copy, Debug)] pub struct GetPostsOfUserParams < > { pub owner_id : i32,pub pageSize : i64,pub offset : i64,}pub struct I32Query < 'a, C : GenericClient, T, const N : usize >
{
    client : & 'a  C, params :
    [& 'a (dyn postgres_types :: ToSql + Sync) ; N], stmt : & 'a mut cornucopia_async
    :: private :: Stmt, extractor : fn(& tokio_postgres :: Row) -> i32,
    mapper : fn(i32) -> T,
} impl < 'a, C, T : 'a, const N : usize > I32Query < 'a, C, T, N >
where C : GenericClient
{
    pub fn map < R > (self, mapper : fn(i32) -> R) -> I32Query
    < 'a, C, R, N >
    {
        I32Query
        {
            client : self.client, params : self.params, stmt : self.stmt,
            extractor : self.extractor, mapper,
        }
    } pub async fn one(self) -> Result < T, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let row =
        self.client.query_one(stmt, & self.params) .await ? ;
        Ok((self.mapper) ((self.extractor) (& row)))
    } pub async fn all(self) -> Result < Vec < T >, tokio_postgres :: Error >
    { self.iter() .await ?.try_collect().await } pub async fn opt(self) -> Result
    < Option < T >, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ;
        Ok(self.client.query_opt(stmt, & self.params) .await
        ?.map(| row | (self.mapper) ((self.extractor) (& row))))
    } pub async fn iter(self,) -> Result < impl futures::Stream < Item = Result
    < T, tokio_postgres :: Error >> + 'a, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let it =
        self.client.query_raw(stmt, cornucopia_async :: private ::
        slice_iter(& self.params)) .await ?
        .map(move | res |
        res.map(| row | (self.mapper) ((self.extractor) (& row)))) .into_stream() ;
        Ok(it)
    }
}#[derive( Debug, Clone, PartialEq, )] pub struct GetPostsOfUser
{ pub id : i32,pub description : String,pub created_at : time::PrimitiveDateTime,}pub struct GetPostsOfUserBorrowed < 'a >
{ pub id : i32,pub description : &'a str,pub created_at : time::PrimitiveDateTime,} impl < 'a > From < GetPostsOfUserBorrowed <
'a >> for GetPostsOfUser
{
    fn
    from(GetPostsOfUserBorrowed { id,description,created_at,} : GetPostsOfUserBorrowed < 'a >)
    -> Self { Self { id,description: description.into(),created_at,} }
}pub struct GetPostsOfUserQuery < 'a, C : GenericClient, T, const N : usize >
{
    client : & 'a  C, params :
    [& 'a (dyn postgres_types :: ToSql + Sync) ; N], stmt : & 'a mut cornucopia_async
    :: private :: Stmt, extractor : fn(& tokio_postgres :: Row) -> GetPostsOfUserBorrowed,
    mapper : fn(GetPostsOfUserBorrowed) -> T,
} impl < 'a, C, T : 'a, const N : usize > GetPostsOfUserQuery < 'a, C, T, N >
where C : GenericClient
{
    pub fn map < R > (self, mapper : fn(GetPostsOfUserBorrowed) -> R) -> GetPostsOfUserQuery
    < 'a, C, R, N >
    {
        GetPostsOfUserQuery
        {
            client : self.client, params : self.params, stmt : self.stmt,
            extractor : self.extractor, mapper,
        }
    } pub async fn one(self) -> Result < T, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let row =
        self.client.query_one(stmt, & self.params) .await ? ;
        Ok((self.mapper) ((self.extractor) (& row)))
    } pub async fn all(self) -> Result < Vec < T >, tokio_postgres :: Error >
    { self.iter() .await ?.try_collect().await } pub async fn opt(self) -> Result
    < Option < T >, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ;
        Ok(self.client.query_opt(stmt, & self.params) .await
        ?.map(| row | (self.mapper) ((self.extractor) (& row))))
    } pub async fn iter(self,) -> Result < impl futures::Stream < Item = Result
    < T, tokio_postgres :: Error >> + 'a, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let it =
        self.client.query_raw(stmt, cornucopia_async :: private ::
        slice_iter(& self.params)) .await ?
        .map(move | res |
        res.map(| row | (self.mapper) ((self.extractor) (& row)))) .into_stream() ;
        Ok(it)
    }
}#[derive( Debug, Clone, PartialEq, )] pub struct GetPosts
{ pub id : i32,pub owner_id : i32,pub description : String,pub created_at : time::PrimitiveDateTime,}pub struct GetPostsBorrowed < 'a >
{ pub id : i32,pub owner_id : i32,pub description : &'a str,pub created_at : time::PrimitiveDateTime,} impl < 'a > From < GetPostsBorrowed <
'a >> for GetPosts
{
    fn
    from(GetPostsBorrowed { id,owner_id,description,created_at,} : GetPostsBorrowed < 'a >)
    -> Self { Self { id,owner_id,description: description.into(),created_at,} }
}pub struct GetPostsQuery < 'a, C : GenericClient, T, const N : usize >
{
    client : & 'a  C, params :
    [& 'a (dyn postgres_types :: ToSql + Sync) ; N], stmt : & 'a mut cornucopia_async
    :: private :: Stmt, extractor : fn(& tokio_postgres :: Row) -> GetPostsBorrowed,
    mapper : fn(GetPostsBorrowed) -> T,
} impl < 'a, C, T : 'a, const N : usize > GetPostsQuery < 'a, C, T, N >
where C : GenericClient
{
    pub fn map < R > (self, mapper : fn(GetPostsBorrowed) -> R) -> GetPostsQuery
    < 'a, C, R, N >
    {
        GetPostsQuery
        {
            client : self.client, params : self.params, stmt : self.stmt,
            extractor : self.extractor, mapper,
        }
    } pub async fn one(self) -> Result < T, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let row =
        self.client.query_one(stmt, & self.params) .await ? ;
        Ok((self.mapper) ((self.extractor) (& row)))
    } pub async fn all(self) -> Result < Vec < T >, tokio_postgres :: Error >
    { self.iter() .await ?.try_collect().await } pub async fn opt(self) -> Result
    < Option < T >, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ;
        Ok(self.client.query_opt(stmt, & self.params) .await
        ?.map(| row | (self.mapper) ((self.extractor) (& row))))
    } pub async fn iter(self,) -> Result < impl futures::Stream < Item = Result
    < T, tokio_postgres :: Error >> + 'a, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let it =
        self.client.query_raw(stmt, cornucopia_async :: private ::
        slice_iter(& self.params)) .await ?
        .map(move | res |
        res.map(| row | (self.mapper) ((self.extractor) (& row)))) .into_stream() ;
        Ok(it)
    }
}pub fn create() -> CreateStmt
{ CreateStmt(cornucopia_async :: private :: Stmt :: new("INSERT INTO
	posts (owner_id, description)
VALUES
	($1, $2) RETURNING id")) } pub
struct CreateStmt(cornucopia_async :: private :: Stmt) ; impl
CreateStmt { pub fn bind < 'a, C : GenericClient, T1 : cornucopia_async::StringSql,>
(& 'a mut self, client : & 'a  C,
owner_id : & 'a i32,description : & 'a T1,) -> I32Query < 'a, C,
i32, 2 >
{
    I32Query
    {
        client, params : [owner_id,description,], stmt : & mut self.0, extractor :
        | row | { row.get(0) }, mapper : | it | { it },
    }
} }impl < 'a, C : GenericClient, T1 : cornucopia_async::StringSql,> cornucopia_async ::
Params < 'a, CreateParams < T1,>, I32Query < 'a,
C, i32, 2 >, C > for CreateStmt
{
    fn
    params(& 'a mut self, client : & 'a  C, params : & 'a
    CreateParams < T1,>) -> I32Query < 'a, C,
    i32, 2 >
    { self.bind(client, & params.owner_id,& params.description,) }
}pub fn getPostsOfUser() -> GetPostsOfUserStmt
{ GetPostsOfUserStmt(cornucopia_async :: private :: Stmt :: new("SELECT
	id,
	description,
	created_at
FROM
	posts
WHERE
	owner_id = $1
LIMIT
	$2 OFFSET $3")) } pub
struct GetPostsOfUserStmt(cornucopia_async :: private :: Stmt) ; impl
GetPostsOfUserStmt { pub fn bind < 'a, C : GenericClient, >
(& 'a mut self, client : & 'a  C,
owner_id : & 'a i32,pageSize : & 'a i64,offset : & 'a i64,) -> GetPostsOfUserQuery < 'a, C,
GetPostsOfUser, 3 >
{
    GetPostsOfUserQuery
    {
        client, params : [owner_id,pageSize,offset,], stmt : & mut self.0, extractor :
        | row | { GetPostsOfUserBorrowed { id : row.get(0),description : row.get(1),created_at : row.get(2),} }, mapper : | it | { <GetPostsOfUser>::from(it) },
    }
} }impl < 'a, C : GenericClient, > cornucopia_async ::
Params < 'a, GetPostsOfUserParams < >, GetPostsOfUserQuery < 'a,
C, GetPostsOfUser, 3 >, C > for GetPostsOfUserStmt
{
    fn
    params(& 'a mut self, client : & 'a  C, params : & 'a
    GetPostsOfUserParams < >) -> GetPostsOfUserQuery < 'a, C,
    GetPostsOfUser, 3 >
    { self.bind(client, & params.owner_id,& params.pageSize,& params.offset,) }
}pub fn getPosts() -> GetPostsStmt
{ GetPostsStmt(cornucopia_async :: private :: Stmt :: new("SELECT
	id,
	owner_id,
	description,
	created_at
FROM
	posts
WHERE
	id = ANY($1)
ORDER BY
	created_at DESC")) } pub
struct GetPostsStmt(cornucopia_async :: private :: Stmt) ; impl
GetPostsStmt { pub fn bind < 'a, C : GenericClient, T1 : cornucopia_async::ArraySql<Item = i32>,>
(& 'a mut self, client : & 'a  C,
post_ids : & 'a T1,) -> GetPostsQuery < 'a, C,
GetPosts, 1 >
{
    GetPostsQuery
    {
        client, params : [post_ids,], stmt : & mut self.0, extractor :
        | row | { GetPostsBorrowed { id : row.get(0),owner_id : row.get(1),description : row.get(2),created_at : row.get(3),} }, mapper : | it | { <GetPosts>::from(it) },
    }
} }}pub mod profiles_microservice
{ use futures::{{StreamExt, TryStreamExt}};use futures; use cornucopia_async::GenericClient;#[derive( Debug)] pub struct CreateParams < T1 : cornucopia_async::StringSql,T2 : cornucopia_async::StringSql,> { pub id : i32,pub name : T1,pub username : T2,}#[derive( Debug, Clone, PartialEq, )] pub struct GetProfilePreviews
{ pub name : String,pub username : String,}pub struct GetProfilePreviewsBorrowed < 'a >
{ pub name : &'a str,pub username : &'a str,} impl < 'a > From < GetProfilePreviewsBorrowed <
'a >> for GetProfilePreviews
{
    fn
    from(GetProfilePreviewsBorrowed { name,username,} : GetProfilePreviewsBorrowed < 'a >)
    -> Self { Self { name: name.into(),username: username.into(),} }
}pub struct GetProfilePreviewsQuery < 'a, C : GenericClient, T, const N : usize >
{
    client : & 'a  C, params :
    [& 'a (dyn postgres_types :: ToSql + Sync) ; N], stmt : & 'a mut cornucopia_async
    :: private :: Stmt, extractor : fn(& tokio_postgres :: Row) -> GetProfilePreviewsBorrowed,
    mapper : fn(GetProfilePreviewsBorrowed) -> T,
} impl < 'a, C, T : 'a, const N : usize > GetProfilePreviewsQuery < 'a, C, T, N >
where C : GenericClient
{
    pub fn map < R > (self, mapper : fn(GetProfilePreviewsBorrowed) -> R) -> GetProfilePreviewsQuery
    < 'a, C, R, N >
    {
        GetProfilePreviewsQuery
        {
            client : self.client, params : self.params, stmt : self.stmt,
            extractor : self.extractor, mapper,
        }
    } pub async fn one(self) -> Result < T, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let row =
        self.client.query_one(stmt, & self.params) .await ? ;
        Ok((self.mapper) ((self.extractor) (& row)))
    } pub async fn all(self) -> Result < Vec < T >, tokio_postgres :: Error >
    { self.iter() .await ?.try_collect().await } pub async fn opt(self) -> Result
    < Option < T >, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ;
        Ok(self.client.query_opt(stmt, & self.params) .await
        ?.map(| row | (self.mapper) ((self.extractor) (& row))))
    } pub async fn iter(self,) -> Result < impl futures::Stream < Item = Result
    < T, tokio_postgres :: Error >> + 'a, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let it =
        self.client.query_raw(stmt, cornucopia_async :: private ::
        slice_iter(& self.params)) .await ?
        .map(move | res |
        res.map(| row | (self.mapper) ((self.extractor) (& row)))) .into_stream() ;
        Ok(it)
    }
}pub fn create() -> CreateStmt
{ CreateStmt(cornucopia_async :: private :: Stmt :: new("INSERT INTO profiles
  (id, name, username)
  VALUES ($1, $2, $3)")) } pub
struct CreateStmt(cornucopia_async :: private :: Stmt) ; impl
CreateStmt { pub async fn bind < 'a, C : GenericClient, T1 : cornucopia_async::StringSql,T2 : cornucopia_async::StringSql,>
(& 'a mut self, client : & 'a  C,
id : & 'a i32,name : & 'a T1,username : & 'a T2,) -> Result < u64, tokio_postgres :: Error >
{
    let stmt = self.0.prepare(client) .await ? ;
    client.execute(stmt, & [id,name,username,]) .await
} }impl < 'a, C : GenericClient + Send + Sync, T1 : cornucopia_async::StringSql,T2 : cornucopia_async::StringSql,>
cornucopia_async :: Params < 'a, CreateParams < T1,T2,>, std::pin::Pin<Box<dyn futures::Future<Output = Result <
u64, tokio_postgres :: Error > > + Send + 'a>>, C > for CreateStmt
{
    fn
    params(& 'a mut self, client : & 'a  C, params : & 'a
    CreateParams < T1,T2,>) -> std::pin::Pin<Box<dyn futures::Future<Output = Result < u64, tokio_postgres ::
    Error > > + Send + 'a>> { Box::pin(self.bind(client, & params.id,& params.name,& params.username,) ) }
}pub fn getProfilePreviews() -> GetProfilePreviewsStmt
{ GetProfilePreviewsStmt(cornucopia_async :: private :: Stmt :: new("SELECT name, username FROM profiles
  WHERE id= ANY($1)")) } pub
struct GetProfilePreviewsStmt(cornucopia_async :: private :: Stmt) ; impl
GetProfilePreviewsStmt { pub fn bind < 'a, C : GenericClient, T1 : cornucopia_async::ArraySql<Item = i32>,>
(& 'a mut self, client : & 'a  C,
ids : & 'a T1,) -> GetProfilePreviewsQuery < 'a, C,
GetProfilePreviews, 1 >
{
    GetProfilePreviewsQuery
    {
        client, params : [ids,], stmt : & mut self.0, extractor :
        | row | { GetProfilePreviewsBorrowed { name : row.get(0),username : row.get(1),} }, mapper : | it | { <GetProfilePreviews>::from(it) },
    }
} }}pub mod users_microservice
{ use futures::{{StreamExt, TryStreamExt}};use futures; use cornucopia_async::GenericClient;#[derive( Debug)] pub struct CreateParams < T1 : cornucopia_async::StringSql,T2 : cornucopia_async::StringSql,T3 : cornucopia_async::StringSql,T4 : cornucopia_async::StringSql,> { pub name : T1,pub email : T2,pub username : T3,pub password : T4,}pub struct I32Query < 'a, C : GenericClient, T, const N : usize >
{
    client : & 'a  C, params :
    [& 'a (dyn postgres_types :: ToSql + Sync) ; N], stmt : & 'a mut cornucopia_async
    :: private :: Stmt, extractor : fn(& tokio_postgres :: Row) -> i32,
    mapper : fn(i32) -> T,
} impl < 'a, C, T : 'a, const N : usize > I32Query < 'a, C, T, N >
where C : GenericClient
{
    pub fn map < R > (self, mapper : fn(i32) -> R) -> I32Query
    < 'a, C, R, N >
    {
        I32Query
        {
            client : self.client, params : self.params, stmt : self.stmt,
            extractor : self.extractor, mapper,
        }
    } pub async fn one(self) -> Result < T, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let row =
        self.client.query_one(stmt, & self.params) .await ? ;
        Ok((self.mapper) ((self.extractor) (& row)))
    } pub async fn all(self) -> Result < Vec < T >, tokio_postgres :: Error >
    { self.iter() .await ?.try_collect().await } pub async fn opt(self) -> Result
    < Option < T >, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ;
        Ok(self.client.query_opt(stmt, & self.params) .await
        ?.map(| row | (self.mapper) ((self.extractor) (& row))))
    } pub async fn iter(self,) -> Result < impl futures::Stream < Item = Result
    < T, tokio_postgres :: Error >> + 'a, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let it =
        self.client.query_raw(stmt, cornucopia_async :: private ::
        slice_iter(& self.params)) .await ?
        .map(move | res |
        res.map(| row | (self.mapper) ((self.extractor) (& row)))) .into_stream() ;
        Ok(it)
    }
}#[derive( Debug, Clone, PartialEq, )] pub struct FindByEmail
{ pub id : i32,pub password : String,}pub struct FindByEmailBorrowed < 'a >
{ pub id : i32,pub password : &'a str,} impl < 'a > From < FindByEmailBorrowed <
'a >> for FindByEmail
{
    fn
    from(FindByEmailBorrowed { id,password,} : FindByEmailBorrowed < 'a >)
    -> Self { Self { id,password: password.into(),} }
}pub struct FindByEmailQuery < 'a, C : GenericClient, T, const N : usize >
{
    client : & 'a  C, params :
    [& 'a (dyn postgres_types :: ToSql + Sync) ; N], stmt : & 'a mut cornucopia_async
    :: private :: Stmt, extractor : fn(& tokio_postgres :: Row) -> FindByEmailBorrowed,
    mapper : fn(FindByEmailBorrowed) -> T,
} impl < 'a, C, T : 'a, const N : usize > FindByEmailQuery < 'a, C, T, N >
where C : GenericClient
{
    pub fn map < R > (self, mapper : fn(FindByEmailBorrowed) -> R) -> FindByEmailQuery
    < 'a, C, R, N >
    {
        FindByEmailQuery
        {
            client : self.client, params : self.params, stmt : self.stmt,
            extractor : self.extractor, mapper,
        }
    } pub async fn one(self) -> Result < T, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let row =
        self.client.query_one(stmt, & self.params) .await ? ;
        Ok((self.mapper) ((self.extractor) (& row)))
    } pub async fn all(self) -> Result < Vec < T >, tokio_postgres :: Error >
    { self.iter() .await ?.try_collect().await } pub async fn opt(self) -> Result
    < Option < T >, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ;
        Ok(self.client.query_opt(stmt, & self.params) .await
        ?.map(| row | (self.mapper) ((self.extractor) (& row))))
    } pub async fn iter(self,) -> Result < impl futures::Stream < Item = Result
    < T, tokio_postgres :: Error >> + 'a, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let it =
        self.client.query_raw(stmt, cornucopia_async :: private ::
        slice_iter(& self.params)) .await ?
        .map(move | res |
        res.map(| row | (self.mapper) ((self.extractor) (& row)))) .into_stream() ;
        Ok(it)
    }
}#[derive( Debug, Clone, PartialEq, )] pub struct FindByUsername
{ pub id : i32,pub password : String,}pub struct FindByUsernameBorrowed < 'a >
{ pub id : i32,pub password : &'a str,} impl < 'a > From < FindByUsernameBorrowed <
'a >> for FindByUsername
{
    fn
    from(FindByUsernameBorrowed { id,password,} : FindByUsernameBorrowed < 'a >)
    -> Self { Self { id,password: password.into(),} }
}pub struct FindByUsernameQuery < 'a, C : GenericClient, T, const N : usize >
{
    client : & 'a  C, params :
    [& 'a (dyn postgres_types :: ToSql + Sync) ; N], stmt : & 'a mut cornucopia_async
    :: private :: Stmt, extractor : fn(& tokio_postgres :: Row) -> FindByUsernameBorrowed,
    mapper : fn(FindByUsernameBorrowed) -> T,
} impl < 'a, C, T : 'a, const N : usize > FindByUsernameQuery < 'a, C, T, N >
where C : GenericClient
{
    pub fn map < R > (self, mapper : fn(FindByUsernameBorrowed) -> R) -> FindByUsernameQuery
    < 'a, C, R, N >
    {
        FindByUsernameQuery
        {
            client : self.client, params : self.params, stmt : self.stmt,
            extractor : self.extractor, mapper,
        }
    } pub async fn one(self) -> Result < T, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let row =
        self.client.query_one(stmt, & self.params) .await ? ;
        Ok((self.mapper) ((self.extractor) (& row)))
    } pub async fn all(self) -> Result < Vec < T >, tokio_postgres :: Error >
    { self.iter() .await ?.try_collect().await } pub async fn opt(self) -> Result
    < Option < T >, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ;
        Ok(self.client.query_opt(stmt, & self.params) .await
        ?.map(| row | (self.mapper) ((self.extractor) (& row))))
    } pub async fn iter(self,) -> Result < impl futures::Stream < Item = Result
    < T, tokio_postgres :: Error >> + 'a, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let it =
        self.client.query_raw(stmt, cornucopia_async :: private ::
        slice_iter(& self.params)) .await ?
        .map(move | res |
        res.map(| row | (self.mapper) ((self.extractor) (& row)))) .into_stream() ;
        Ok(it)
    }
}#[derive( Debug, Clone, PartialEq, )] pub struct FindById
{ pub id : i32,pub password : String,}pub struct FindByIdBorrowed < 'a >
{ pub id : i32,pub password : &'a str,} impl < 'a > From < FindByIdBorrowed <
'a >> for FindById
{
    fn
    from(FindByIdBorrowed { id,password,} : FindByIdBorrowed < 'a >)
    -> Self { Self { id,password: password.into(),} }
}pub struct FindByIdQuery < 'a, C : GenericClient, T, const N : usize >
{
    client : & 'a  C, params :
    [& 'a (dyn postgres_types :: ToSql + Sync) ; N], stmt : & 'a mut cornucopia_async
    :: private :: Stmt, extractor : fn(& tokio_postgres :: Row) -> FindByIdBorrowed,
    mapper : fn(FindByIdBorrowed) -> T,
} impl < 'a, C, T : 'a, const N : usize > FindByIdQuery < 'a, C, T, N >
where C : GenericClient
{
    pub fn map < R > (self, mapper : fn(FindByIdBorrowed) -> R) -> FindByIdQuery
    < 'a, C, R, N >
    {
        FindByIdQuery
        {
            client : self.client, params : self.params, stmt : self.stmt,
            extractor : self.extractor, mapper,
        }
    } pub async fn one(self) -> Result < T, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let row =
        self.client.query_one(stmt, & self.params) .await ? ;
        Ok((self.mapper) ((self.extractor) (& row)))
    } pub async fn all(self) -> Result < Vec < T >, tokio_postgres :: Error >
    { self.iter() .await ?.try_collect().await } pub async fn opt(self) -> Result
    < Option < T >, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ;
        Ok(self.client.query_opt(stmt, & self.params) .await
        ?.map(| row | (self.mapper) ((self.extractor) (& row))))
    } pub async fn iter(self,) -> Result < impl futures::Stream < Item = Result
    < T, tokio_postgres :: Error >> + 'a, tokio_postgres :: Error >
    {
        let stmt = self.stmt.prepare(self.client) .await ? ; let it =
        self.client.query_raw(stmt, cornucopia_async :: private ::
        slice_iter(& self.params)) .await ?
        .map(move | res |
        res.map(| row | (self.mapper) ((self.extractor) (& row)))) .into_stream() ;
        Ok(it)
    }
}pub fn create() -> CreateStmt
{ CreateStmt(cornucopia_async :: private :: Stmt :: new("INSERT INTO users
  (name, email, username, password)
  VALUES ($1, $2, $3, $4)
  RETURNING id")) } pub
struct CreateStmt(cornucopia_async :: private :: Stmt) ; impl
CreateStmt { pub fn bind < 'a, C : GenericClient, T1 : cornucopia_async::StringSql,T2 : cornucopia_async::StringSql,T3 : cornucopia_async::StringSql,T4 : cornucopia_async::StringSql,>
(& 'a mut self, client : & 'a  C,
name : & 'a T1,email : & 'a T2,username : & 'a T3,password : & 'a T4,) -> I32Query < 'a, C,
i32, 4 >
{
    I32Query
    {
        client, params : [name,email,username,password,], stmt : & mut self.0, extractor :
        | row | { row.get(0) }, mapper : | it | { it },
    }
} }impl < 'a, C : GenericClient, T1 : cornucopia_async::StringSql,T2 : cornucopia_async::StringSql,T3 : cornucopia_async::StringSql,T4 : cornucopia_async::StringSql,> cornucopia_async ::
Params < 'a, CreateParams < T1,T2,T3,T4,>, I32Query < 'a,
C, i32, 4 >, C > for CreateStmt
{
    fn
    params(& 'a mut self, client : & 'a  C, params : & 'a
    CreateParams < T1,T2,T3,T4,>) -> I32Query < 'a, C,
    i32, 4 >
    { self.bind(client, & params.name,& params.email,& params.username,& params.password,) }
}pub fn findByEmail() -> FindByEmailStmt
{ FindByEmailStmt(cornucopia_async :: private :: Stmt :: new("SELECT id, password FROM users
  WHERE email= $1 LIMIT 1")) } pub
struct FindByEmailStmt(cornucopia_async :: private :: Stmt) ; impl
FindByEmailStmt { pub fn bind < 'a, C : GenericClient, T1 : cornucopia_async::StringSql,>
(& 'a mut self, client : & 'a  C,
email : & 'a T1,) -> FindByEmailQuery < 'a, C,
FindByEmail, 1 >
{
    FindByEmailQuery
    {
        client, params : [email,], stmt : & mut self.0, extractor :
        | row | { FindByEmailBorrowed { id : row.get(0),password : row.get(1),} }, mapper : | it | { <FindByEmail>::from(it) },
    }
} }pub fn findByUsername() -> FindByUsernameStmt
{ FindByUsernameStmt(cornucopia_async :: private :: Stmt :: new("SELECT id, password FROM users
  WHERE username= $1 LIMIT 1")) } pub
struct FindByUsernameStmt(cornucopia_async :: private :: Stmt) ; impl
FindByUsernameStmt { pub fn bind < 'a, C : GenericClient, T1 : cornucopia_async::StringSql,>
(& 'a mut self, client : & 'a  C,
username : & 'a T1,) -> FindByUsernameQuery < 'a, C,
FindByUsername, 1 >
{
    FindByUsernameQuery
    {
        client, params : [username,], stmt : & mut self.0, extractor :
        | row | { FindByUsernameBorrowed { id : row.get(0),password : row.get(1),} }, mapper : | it | { <FindByUsername>::from(it) },
    }
} }pub fn findById() -> FindByIdStmt
{ FindByIdStmt(cornucopia_async :: private :: Stmt :: new("SELECT id, password FROM users
  WHERE id= $1 LIMIT 1")) } pub
struct FindByIdStmt(cornucopia_async :: private :: Stmt) ; impl
FindByIdStmt { pub fn bind < 'a, C : GenericClient, >
(& 'a mut self, client : & 'a  C,
id : & 'a i32,) -> FindByIdQuery < 'a, C,
FindById, 1 >
{
    FindByIdQuery
    {
        client, params : [id,], stmt : & mut self.0, extractor :
        | row | { FindByIdBorrowed { id : row.get(0),password : row.get(1),} }, mapper : | it | { <FindById>::from(it) },
    }
} }}}