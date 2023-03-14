mod start_registration_usecase;
pub use start_registration_usecase::*;

use super::Ports;

pub struct Usecases<'a> {

    usersRepository: &'a dyn Ports::UsersRepositoryPort,
    temporaryUserRecordsRepository: &'a dyn Ports::TemporaryUserRecordsRepositoryPort

}