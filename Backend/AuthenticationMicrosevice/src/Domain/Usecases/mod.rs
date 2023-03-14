mod start_registration_usecase;
pub use start_registration_usecase::*;

use super::Ports;

pub struct Usecases<'lifetimeLinker> {

    usersRepository: &'lifetimeLinker dyn Ports::UsersRepositoryPort,
    temporaryUserRecordsRepository: &'lifetimeLinker dyn Ports::TemporaryUserRecordsRepositoryPort

}