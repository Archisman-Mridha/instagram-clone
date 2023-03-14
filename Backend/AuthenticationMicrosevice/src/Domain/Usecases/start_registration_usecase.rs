use crate::Domain::ValueObjects::TemporaryUserRecord;

use super::Usecases;

pub struct StartRegistrationParameters {

    name: String,
    email: String,
    username: String,
    password: String,
    deviceIP: String
}

#[derive(Default)]
pub struct StartRegistrationOutput {
    otp: String,

    errors: Vec<String>
}

impl Usecases<'_> {
    pub fn StartRegistration<OTPGenerator>(&self, parameters: &StartRegistrationParameters, otpGenerator: OTPGenerator) -> StartRegistrationOutput
        where OTPGenerator: Fn( ) -> String
    {
        let mut errors: Vec<String>= Vec::new( );

        // Check if email or username is duplicate
        let searchResult= self.usersRepository.getByEmailOrUsername(&parameters.email, &parameters.username).unwrap( );
        match searchResult {
            Some(existingUsers) => {
                for existingUser in existingUsers {

                    if existingUser.email == parameters.email {
                        errors.push("Email is already in use".to_string( ));}

                    if existingUser.username == parameters.username {
                        errors.push("Username is already in use".to_string( ));}
                }

                return StartRegistrationOutput { errors, ..Default::default( ) };
            },

            None => { }
        }

        // Check if somebody else is currently registering with the same email
        let searchResult= self.temporaryUserRecordsRepository.getByEmail(&parameters.email).unwrap( );
        match searchResult {
            Some(existingRecord) => {

                if existingRecord.deviceIP != parameters.deviceIP {
                    errors.push("Someone from a separate device is registering with this email. Retry after 2 minutes".to_string( ));

                    return StartRegistrationOutput { errors, ..Default::default( ) };
                }
            },

            None => { }
        }

        // Check if somebody else is currently registering with the same username
        let searchResult= self.temporaryUserRecordsRepository.getByUsername(&parameters.email).unwrap( );
        match searchResult {
            Some(_) => {
                errors.push("Someone is registering with this username. Retry after 2 minutes".to_string( ));

                return StartRegistrationOutput { errors, ..Default::default( ) };
            },

            None => { }
        }

        let otp= otpGenerator( );

        // save temporary user details in cache
        self.temporaryUserRecordsRepository.save(
            &TemporaryUserRecord {

                otp: otp.clone( ),
                name: parameters.name.clone( ),
                email: parameters.email.clone( ),
                username: parameters.username.clone( ),
                password: parameters.password.clone( ),
                deviceIP: parameters.deviceIP.clone( )

            }
        ).unwrap( );

        return StartRegistrationOutput { otp, errors };
    }
}

#[cfg(test)]
mod tests {
    use crate::Domain::{Ports::{MockUsersRepositoryPort, MockTemporaryUserRecordsRepositoryPort}, Entities::UserEntity};

    use super::*;
    use fake::{faker::{internet::en::{FreeEmail, Username, Password, IP}, name::en::Name}, Fake};

    #[test]
    fn StartRegistrationSuccessfully( ) {

        let mut mockUsersRepository= MockUsersRepositoryPort::new( );
        let mut mockTemporaryUserRecordsRepository= MockTemporaryUserRecordsRepositoryPort::new( );

        let parameters= StartRegistrationParameters {

            name: Name( ).fake( ),
            email: FreeEmail( ).fake( ),
            username: Username( ).fake( ),
            password: Password(6..10).fake( ),
            deviceIP: IP( ).fake( )
        };

        let dummyOTP= "000000".to_string( );

        mockUsersRepository.expect_getByEmailOrUsername( )
            .returning(|_, _| Ok(None));

        mockTemporaryUserRecordsRepository.expect_getByEmail( )
            .returning(|_| Ok(None));
        mockTemporaryUserRecordsRepository.expect_getByUsername( )
            .returning(|_| Ok(None));
        mockTemporaryUserRecordsRepository.expect_save( )
            .returning(|_| Ok(( )));

        let usecases: Usecases= Usecases {

            usersRepository: &mockUsersRepository,
            temporaryUserRecordsRepository: &mockTemporaryUserRecordsRepository
        };

        let output= usecases.StartRegistration(&parameters, | | dummyOTP.clone( ));

        assert!(output.errors.len( ) == 0);
        assert!(output.otp == dummyOTP);
    }

    #[test]
    fn DetectDuplicateEmailAndUsername( ) {

        let mut mockUsersRepository= MockUsersRepositoryPort::new( );
        let mut mockTemporaryUserRecordsRepository= MockTemporaryUserRecordsRepositoryPort::new( );

        let parameters= StartRegistrationParameters {

            name: Name( ).fake( ),
            email: FreeEmail( ).fake( ),
            username: Username( ).fake( ),
            password: Password(6..10).fake( ),
            deviceIP: IP( ).fake( )
        };

        let email= parameters.email.clone( );
        let username= parameters.username.clone( );
        mockUsersRepository.expect_getByEmailOrUsername( )
            .returning(
                move |_, _| Ok(Some(
                    vec![

                        UserEntity {
                            email: email.clone( ),
                            ..Default::default( )
                        },
                        UserEntity {
                            username: username.clone( ),
                            ..Default::default( )
                        }
                    ]
                ))
            );

        mockTemporaryUserRecordsRepository.expect_getByEmail( )
            .returning(|_| Ok(None));
        mockTemporaryUserRecordsRepository.expect_getByUsername( )
            .returning(|_| Ok(None));
        mockTemporaryUserRecordsRepository.expect_save( )
            .returning(|_| Ok(( )));

        let usecases: Usecases= Usecases {

            usersRepository: &mockUsersRepository,
            temporaryUserRecordsRepository: &mockTemporaryUserRecordsRepository
        };

        let output= usecases.StartRegistration(&parameters, | | "000000".to_string( ));

        assert!(output.errors.len( ) == 2);
            assert!(
                output.errors.iter( ).any(|error| error == "Email is already in use")
            );
            assert!(
                output.errors.iter( ).any(|error| error == "Username is already in use")
            );
    }

    #[test]
    fn DetectEmailBeingRegisteredBySomeoneElse( ) {

        let mut mockUsersRepository= MockUsersRepositoryPort::new( );
        let mut mockTemporaryUserRecordsRepository= MockTemporaryUserRecordsRepositoryPort::new( );

        let parameters= StartRegistrationParameters {

            name: Name( ).fake( ),
            email: FreeEmail( ).fake( ),
            username: Username( ).fake( ),
            password: Password(6..10).fake( ),
            deviceIP: IP( ).fake( )
        };

        mockUsersRepository.expect_getByEmailOrUsername( )
            .returning(|_, _| Ok(None));

        let email= parameters.email.clone( );
        mockTemporaryUserRecordsRepository.expect_getByEmail( )
            .returning(
                move |_| Ok(
                    Some(
                        TemporaryUserRecord {
                            email: email.clone( ),
                            ..Default::default( )
                        }
                    )
                )
            );
        mockTemporaryUserRecordsRepository.expect_getByUsername( )
            .returning(|_| Ok(None));
        mockTemporaryUserRecordsRepository.expect_save( )
            .returning(|_| Ok(( )));

        let usecases: Usecases= Usecases {

            usersRepository: &mockUsersRepository,
            temporaryUserRecordsRepository: &mockTemporaryUserRecordsRepository
        };

        let output= usecases.StartRegistration(&parameters, | | "000000".to_string( ));

        assert!(output.errors.len( ) == 1);
            assert!(
                output.errors.iter( ).any(|error| error == "Someone from a separate device is registering with this email. Retry after 2 minutes")
            );
    }

    #[test]
    fn DetectUsernameBeingRegisteredBySomeoneElse( ) {

        let mut mockUsersRepository= MockUsersRepositoryPort::new( );
        let mut mockTemporaryUserRecordsRepository= MockTemporaryUserRecordsRepositoryPort::new( );

        let parameters= StartRegistrationParameters {

            name: Name( ).fake( ),
            email: FreeEmail( ).fake( ),
            username: Username( ).fake( ),
            password: Password(6..10).fake( ),
            deviceIP: IP( ).fake( )
        };

        mockUsersRepository.expect_getByEmailOrUsername( )
            .returning(|_, _| Ok(None));

        let username= parameters.username.clone( );
        mockTemporaryUserRecordsRepository.expect_getByUsername( )
            .returning(
                move |_| Ok(
                    Some(
                        TemporaryUserRecord {
                            username: username.clone( ),
                            ..Default::default( )
                        }
                    )
                )
            );
        mockTemporaryUserRecordsRepository.expect_getByEmail( )
            .returning(|_| Ok(None));
        mockTemporaryUserRecordsRepository.expect_save( )
            .returning(|_| Ok(( )));

        let usecases: Usecases= Usecases {

            usersRepository: &mockUsersRepository,
            temporaryUserRecordsRepository: &mockTemporaryUserRecordsRepository
        };

        let output= usecases.StartRegistration(&parameters, | | "000000".to_string( ));

        assert!(output.errors.len( ) == 1);
            assert!(
                output.errors.iter( ).any(|error| error == "Someone is registering with this username. Retry after 2 minutes")
            );
    }

}