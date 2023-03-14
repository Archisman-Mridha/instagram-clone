use validator::{validate_email, validate_ip, validate_range};

use crate::{Domain::Usecases::{*, Usecases}, Utils::{self, Errors}};

pub struct App<'a> {
    usecases: Usecases<'a>
}

impl App<'_> {

    pub fn StartRegistration(&self, parameters: StartRegistrationParameters) -> StartRegistrationOutput {

        let mut errors: Vec<String>= vec!{ };

        if !validate_email(&parameters.email) {
            errors.push(Errors::InvalidEmail.to_string( ));}

        if !validate_ip(&parameters.deviceIP) {
            errors.push(Errors::InvalidDeviceIP.to_string( ));}

        // TODO: validate remaining parameters : name, username and password

        if errors.len( ) > 0 {
            return StartRegistrationOutput{ errors, ..Default::default( ) }}

        let output= self.usecases.StartRegistration(&parameters, Utils::OTPGenerator::generate);

        // TODO: dispatch domain events

        return output;
    }

}