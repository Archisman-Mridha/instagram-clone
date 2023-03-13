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
    pub fn StartRegistration<OTPGenerator>(&self, parameters: StartRegistrationParameters, otpGenerator: OTPGenerator) -> StartRegistrationOutput
        where OTPGenerator: Fn( ) -> String
    {
        let mut errors: Vec<String>= Vec::new( );

        // Check if email or username is duplicate
        let searchResult= self.usersRepository.getByEmailOrUsername(parameters.email.clone( ), parameters.username.clone( )).unwrap( );
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
        let searchResult= self.temporaryUserRecordsRepository.getByEmail(parameters.email.clone( )).unwrap( );
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
        let searchResult= self.temporaryUserRecordsRepository.getByUsername(parameters.email.clone( )).unwrap( );
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
            TemporaryUserRecord {

                otp: otp.clone( ),
                name: parameters.name,
                email: parameters.email,
                username: parameters.username,
                password: parameters.password,
                deviceIP: parameters.deviceIP

            }
        ).unwrap( );

        return StartRegistrationOutput { otp, errors };
    }
}

#[cfg(test)]
mod tests {
    use crate::Domain::Ports::{MockUsersRepository, MockTemporaryUserRecordsRepository};

    use super::*;
    use fake::{faker::{internet::en::{FreeEmail, Username, Password, IP}, name::en::Name}, Fake};

    #[test]
    fn StartRegistrationSuccessfully( ) {

        let mut mockUsersRepository= MockUsersRepository::new( );

        let mut mockTemporaryUserRecordsRepository= MockTemporaryUserRecordsRepository::new( );

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

        let output= usecases.StartRegistration(parameters, | | dummyOTP.clone( ));

        assert!(output.errors.len( ) == 0);
        assert!(output.otp == dummyOTP);
    }

}