mod start_registration_usecase;
pub use start_registration_usecase::*;

use super::Ports;

pub struct Usecases<'lifetimeLinker> {

    usersRepository: &'lifetimeLinker dyn Ports::UsersRepository,
    temporaryUserRecordsRepository: &'lifetimeLinker dyn Ports::TemporaryUserRecordsRepository

}