use mockall::automock;
use crate::Domain::Entities::UserEntity;

#[automock]
pub trait UsersRepositoryPort {

    fn getByEmailOrUsername(&self, email: &String, username: &String) -> Result<Option<Vec<UserEntity>>, ( )>;

}