// This file was generated with `cornucopia`. Do not modify.

#[allow(clippy::all, clippy::pedantic)]
#[allow(unused_variables)]
#[allow(unused_imports)]
#[allow(dead_code)]
pub mod types {}
#[allow(clippy::all, clippy::pedantic)]
#[allow(unused_variables)]
#[allow(unused_imports)]
#[allow(dead_code)]
pub mod queries {
  pub mod users_microservice {
    use cornucopia_async::GenericClient;
    use futures;
    use futures::{StreamExt, TryStreamExt};
    #[derive(Debug)]
    pub struct CreateParams<
      T1: cornucopia_async::StringSql,
      T2: cornucopia_async::StringSql,
      T3: cornucopia_async::StringSql,
      T4: cornucopia_async::StringSql,
    > {
      pub name: T1,
      pub email: T2,
      pub username: T3,
      pub password: T4,
    }
    pub struct I32Query<'a, C: GenericClient, T, const N: usize> {
      client: &'a C,
      params: [&'a (dyn postgres_types::ToSql + Sync); N],
      stmt: &'a mut cornucopia_async::private::Stmt,
      extractor: fn(&tokio_postgres::Row) -> i32,
      mapper: fn(i32) -> T,
    }
    impl<'a, C, T: 'a, const N: usize> I32Query<'a, C, T, N>
    where
      C: GenericClient,
    {
      pub fn map<R>(self, mapper: fn(i32) -> R) -> I32Query<'a, C, R, N> {
        I32Query {
          client: self.client,
          params: self.params,
          stmt: self.stmt,
          extractor: self.extractor,
          mapper,
        }
      }
      pub async fn one(self) -> Result<T, tokio_postgres::Error> {
        let stmt = self.stmt.prepare(self.client).await?;
        let row = self.client.query_one(stmt, &self.params).await?;
        Ok((self.mapper)((self.extractor)(&row)))
      }
      pub async fn all(self) -> Result<Vec<T>, tokio_postgres::Error> {
        self.iter().await?.try_collect().await
      }
      pub async fn opt(self) -> Result<Option<T>, tokio_postgres::Error> {
        let stmt = self.stmt.prepare(self.client).await?;
        Ok(
          self
            .client
            .query_opt(stmt, &self.params)
            .await?
            .map(|row| (self.mapper)((self.extractor)(&row))),
        )
      }
      pub async fn iter(
        self,
      ) -> Result<
        impl futures::Stream<Item = Result<T, tokio_postgres::Error>> + 'a,
        tokio_postgres::Error,
      > {
        let stmt = self.stmt.prepare(self.client).await?;
        let it = self
          .client
          .query_raw(stmt, cornucopia_async::private::slice_iter(&self.params))
          .await?
          .map(move |res| res.map(|row| (self.mapper)((self.extractor)(&row))))
          .into_stream();
        Ok(it)
      }
    }
    #[derive(Debug, Clone, PartialEq)]
    pub struct FindByEmail {
      pub id: i32,
      pub password: String,
    }
    pub struct FindByEmailBorrowed<'a> {
      pub id: i32,
      pub password: &'a str,
    }
    impl<'a> From<FindByEmailBorrowed<'a>> for FindByEmail {
      fn from(FindByEmailBorrowed { id, password }: FindByEmailBorrowed<'a>) -> Self {
        Self {
          id,
          password: password.into(),
        }
      }
    }
    pub struct FindByEmailQuery<'a, C: GenericClient, T, const N: usize> {
      client: &'a C,
      params: [&'a (dyn postgres_types::ToSql + Sync); N],
      stmt: &'a mut cornucopia_async::private::Stmt,
      extractor: fn(&tokio_postgres::Row) -> FindByEmailBorrowed,
      mapper: fn(FindByEmailBorrowed) -> T,
    }
    impl<'a, C, T: 'a, const N: usize> FindByEmailQuery<'a, C, T, N>
    where
      C: GenericClient,
    {
      pub fn map<R>(self, mapper: fn(FindByEmailBorrowed) -> R) -> FindByEmailQuery<'a, C, R, N> {
        FindByEmailQuery {
          client: self.client,
          params: self.params,
          stmt: self.stmt,
          extractor: self.extractor,
          mapper,
        }
      }
      pub async fn one(self) -> Result<T, tokio_postgres::Error> {
        let stmt = self.stmt.prepare(self.client).await?;
        let row = self.client.query_one(stmt, &self.params).await?;
        Ok((self.mapper)((self.extractor)(&row)))
      }
      pub async fn all(self) -> Result<Vec<T>, tokio_postgres::Error> {
        self.iter().await?.try_collect().await
      }
      pub async fn opt(self) -> Result<Option<T>, tokio_postgres::Error> {
        let stmt = self.stmt.prepare(self.client).await?;
        Ok(
          self
            .client
            .query_opt(stmt, &self.params)
            .await?
            .map(|row| (self.mapper)((self.extractor)(&row))),
        )
      }
      pub async fn iter(
        self,
      ) -> Result<
        impl futures::Stream<Item = Result<T, tokio_postgres::Error>> + 'a,
        tokio_postgres::Error,
      > {
        let stmt = self.stmt.prepare(self.client).await?;
        let it = self
          .client
          .query_raw(stmt, cornucopia_async::private::slice_iter(&self.params))
          .await?
          .map(move |res| res.map(|row| (self.mapper)((self.extractor)(&row))))
          .into_stream();
        Ok(it)
      }
    }
    #[derive(Debug, Clone, PartialEq)]
    pub struct FindByUsername {
      pub id: i32,
      pub password: String,
    }
    pub struct FindByUsernameBorrowed<'a> {
      pub id: i32,
      pub password: &'a str,
    }
    impl<'a> From<FindByUsernameBorrowed<'a>> for FindByUsername {
      fn from(FindByUsernameBorrowed { id, password }: FindByUsernameBorrowed<'a>) -> Self {
        Self {
          id,
          password: password.into(),
        }
      }
    }
    pub struct FindByUsernameQuery<'a, C: GenericClient, T, const N: usize> {
      client: &'a C,
      params: [&'a (dyn postgres_types::ToSql + Sync); N],
      stmt: &'a mut cornucopia_async::private::Stmt,
      extractor: fn(&tokio_postgres::Row) -> FindByUsernameBorrowed,
      mapper: fn(FindByUsernameBorrowed) -> T,
    }
    impl<'a, C, T: 'a, const N: usize> FindByUsernameQuery<'a, C, T, N>
    where
      C: GenericClient,
    {
      pub fn map<R>(
        self,
        mapper: fn(FindByUsernameBorrowed) -> R,
      ) -> FindByUsernameQuery<'a, C, R, N> {
        FindByUsernameQuery {
          client: self.client,
          params: self.params,
          stmt: self.stmt,
          extractor: self.extractor,
          mapper,
        }
      }
      pub async fn one(self) -> Result<T, tokio_postgres::Error> {
        let stmt = self.stmt.prepare(self.client).await?;
        let row = self.client.query_one(stmt, &self.params).await?;
        Ok((self.mapper)((self.extractor)(&row)))
      }
      pub async fn all(self) -> Result<Vec<T>, tokio_postgres::Error> {
        self.iter().await?.try_collect().await
      }
      pub async fn opt(self) -> Result<Option<T>, tokio_postgres::Error> {
        let stmt = self.stmt.prepare(self.client).await?;
        Ok(
          self
            .client
            .query_opt(stmt, &self.params)
            .await?
            .map(|row| (self.mapper)((self.extractor)(&row))),
        )
      }
      pub async fn iter(
        self,
      ) -> Result<
        impl futures::Stream<Item = Result<T, tokio_postgres::Error>> + 'a,
        tokio_postgres::Error,
      > {
        let stmt = self.stmt.prepare(self.client).await?;
        let it = self
          .client
          .query_raw(stmt, cornucopia_async::private::slice_iter(&self.params))
          .await?
          .map(move |res| res.map(|row| (self.mapper)((self.extractor)(&row))))
          .into_stream();
        Ok(it)
      }
    }
    #[derive(Debug, Clone, PartialEq)]
    pub struct FindById {
      pub id: i32,
      pub password: String,
    }
    pub struct FindByIdBorrowed<'a> {
      pub id: i32,
      pub password: &'a str,
    }
    impl<'a> From<FindByIdBorrowed<'a>> for FindById {
      fn from(FindByIdBorrowed { id, password }: FindByIdBorrowed<'a>) -> Self {
        Self {
          id,
          password: password.into(),
        }
      }
    }
    pub struct FindByIdQuery<'a, C: GenericClient, T, const N: usize> {
      client: &'a C,
      params: [&'a (dyn postgres_types::ToSql + Sync); N],
      stmt: &'a mut cornucopia_async::private::Stmt,
      extractor: fn(&tokio_postgres::Row) -> FindByIdBorrowed,
      mapper: fn(FindByIdBorrowed) -> T,
    }
    impl<'a, C, T: 'a, const N: usize> FindByIdQuery<'a, C, T, N>
    where
      C: GenericClient,
    {
      pub fn map<R>(self, mapper: fn(FindByIdBorrowed) -> R) -> FindByIdQuery<'a, C, R, N> {
        FindByIdQuery {
          client: self.client,
          params: self.params,
          stmt: self.stmt,
          extractor: self.extractor,
          mapper,
        }
      }
      pub async fn one(self) -> Result<T, tokio_postgres::Error> {
        let stmt = self.stmt.prepare(self.client).await?;
        let row = self.client.query_one(stmt, &self.params).await?;
        Ok((self.mapper)((self.extractor)(&row)))
      }
      pub async fn all(self) -> Result<Vec<T>, tokio_postgres::Error> {
        self.iter().await?.try_collect().await
      }
      pub async fn opt(self) -> Result<Option<T>, tokio_postgres::Error> {
        let stmt = self.stmt.prepare(self.client).await?;
        Ok(
          self
            .client
            .query_opt(stmt, &self.params)
            .await?
            .map(|row| (self.mapper)((self.extractor)(&row))),
        )
      }
      pub async fn iter(
        self,
      ) -> Result<
        impl futures::Stream<Item = Result<T, tokio_postgres::Error>> + 'a,
        tokio_postgres::Error,
      > {
        let stmt = self.stmt.prepare(self.client).await?;
        let it = self
          .client
          .query_raw(stmt, cornucopia_async::private::slice_iter(&self.params))
          .await?
          .map(move |res| res.map(|row| (self.mapper)((self.extractor)(&row))))
          .into_stream();
        Ok(it)
      }
    }
    pub fn create() -> CreateStmt {
      CreateStmt(cornucopia_async::private::Stmt::new(
        "INSERT INTO users
  (name, email, username, password)
  VALUES ($1, $2, $3, $4)
  RETURNING id",
      ))
    }
    pub struct CreateStmt(cornucopia_async::private::Stmt);
    impl CreateStmt {
      pub fn bind<
        'a,
        C: GenericClient,
        T1: cornucopia_async::StringSql,
        T2: cornucopia_async::StringSql,
        T3: cornucopia_async::StringSql,
        T4: cornucopia_async::StringSql,
      >(
        &'a mut self,
        client: &'a C,
        name: &'a T1,
        email: &'a T2,
        username: &'a T3,
        password: &'a T4,
      ) -> I32Query<'a, C, i32, 4> {
        I32Query {
          client,
          params: [name, email, username, password],
          stmt: &mut self.0,
          extractor: |row| row.get(0),
          mapper: |it| it,
        }
      }
    }
    impl<
        'a,
        C: GenericClient,
        T1: cornucopia_async::StringSql,
        T2: cornucopia_async::StringSql,
        T3: cornucopia_async::StringSql,
        T4: cornucopia_async::StringSql,
      > cornucopia_async::Params<'a, CreateParams<T1, T2, T3, T4>, I32Query<'a, C, i32, 4>, C>
      for CreateStmt
    {
      fn params(
        &'a mut self,
        client: &'a C,
        params: &'a CreateParams<T1, T2, T3, T4>,
      ) -> I32Query<'a, C, i32, 4> {
        self.bind(
          client,
          &params.name,
          &params.email,
          &params.username,
          &params.password,
        )
      }
    }
    pub fn findByEmail() -> FindByEmailStmt {
      FindByEmailStmt(cornucopia_async::private::Stmt::new(
        "SELECT id, password FROM users
  WHERE email= $1 LIMIT 1",
      ))
    }
    pub struct FindByEmailStmt(cornucopia_async::private::Stmt);
    impl FindByEmailStmt {
      pub fn bind<'a, C: GenericClient, T1: cornucopia_async::StringSql>(
        &'a mut self,
        client: &'a C,
        email: &'a T1,
      ) -> FindByEmailQuery<'a, C, FindByEmail, 1> {
        FindByEmailQuery {
          client,
          params: [email],
          stmt: &mut self.0,
          extractor: |row| FindByEmailBorrowed {
            id: row.get(0),
            password: row.get(1),
          },
          mapper: |it| <FindByEmail>::from(it),
        }
      }
    }
    pub fn findByUsername() -> FindByUsernameStmt {
      FindByUsernameStmt(cornucopia_async::private::Stmt::new(
        "SELECT id, password FROM users
  WHERE username= $1 LIMIT 1",
      ))
    }
    pub struct FindByUsernameStmt(cornucopia_async::private::Stmt);
    impl FindByUsernameStmt {
      pub fn bind<'a, C: GenericClient, T1: cornucopia_async::StringSql>(
        &'a mut self,
        client: &'a C,
        username: &'a T1,
      ) -> FindByUsernameQuery<'a, C, FindByUsername, 1> {
        FindByUsernameQuery {
          client,
          params: [username],
          stmt: &mut self.0,
          extractor: |row| FindByUsernameBorrowed {
            id: row.get(0),
            password: row.get(1),
          },
          mapper: |it| <FindByUsername>::from(it),
        }
      }
    }
    pub fn findById() -> FindByIdStmt {
      FindByIdStmt(cornucopia_async::private::Stmt::new(
        "SELECT id, password FROM users
  WHERE id= $1 LIMIT 1",
      ))
    }
    pub struct FindByIdStmt(cornucopia_async::private::Stmt);
    impl FindByIdStmt {
      pub fn bind<'a, C: GenericClient>(
        &'a mut self,
        client: &'a C,
        id: &'a i32,
      ) -> FindByIdQuery<'a, C, FindById, 1> {
        FindByIdQuery {
          client,
          params: [id],
          stmt: &mut self.0,
          extractor: |row| FindByIdBorrowed {
            id: row.get(0),
            password: row.get(1),
          },
          mapper: |it| <FindById>::from(it),
        }
      }
    }
  }
}
