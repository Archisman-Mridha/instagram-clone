#![allow(non_snake_case)]

wit_bindgen::generate!({ path: ["wasm/wit"] });

use {exports::instagram_clone::users_microservice::validators::Guest, validator::ValidateEmail};

pub struct Validators;
export!(Validators);

impl Guest for Validators {
  fn validate_name(name: String) -> Result<(), String> {
    // name must be between 3 - 25 characters long.
    if (name.len() < 3) || (name.len() > 25) {
      return Err(String::from("name must be between 3 - 25 characters long"));
    }

    // name must contain only alphabetic characters.
    if !name.chars().all(char::is_alphabetic) {
      return Err(String::from("name can only contain alphabetic characters"));
    }

    Ok(())
  }

  fn validate_email(email: String) -> Result<(), String> {
    if !email.validate_email() {
      return Err(String::from("email is invalid"));
    }

    Ok(())
  }

  fn validate_username(username: String) -> Result<(), String> {
    // username must be between 3 - 25 characters long.
    if (username.len() < 3) || (username.len() > 25) {
      return Err(String::from(
        "username must be between 3 - 25 characters long",
      ));
    }

    // username can contain only alphanumeric and underscore characters.
    // And, there must be atleast 1 alphabetic character.
    {
      let mut alphabetCount: u8 = 0;

      for character in username.chars() {
        if !character.is_alphanumeric() && (character != '_') {
          return Err(String::from(
            "username can contain only alphanumeric or underscore characters",
          ));
        }

        if character.is_alphabetic() {
          alphabetCount += 1;
        }
      }

      if alphabetCount == 0 {
        return Err(String::from(
          "username must contain atleast one alphabetic character",
        ));
      }
    }

    Ok(())
  }

  // TODO : Validate password based on it's entropy.
  /*
    Password entropy refers to how unpredictable your password or phrase is, measured in bits.
    The following factors affect the password entropy :

      (1) Length (in characters)

      (2) Use of uppercase and lowercase letters, numeric characters and special symbols

    NOTE : Entropy and complexity aren’t the only password strength factors. Hackers can use
           dictionary attacks to guess your credentials if you use a recognizable word or common
           phrase in your password.

    REFERENCE : https://proton.me/blog/what-is-password-entropy.
  */
  fn validate_password(password: String) -> Result<(), String> {
    // password must be between 8 - 30 characters long.
    if (password.len() < 8) || (password.len() > 30) {
      return Err(String::from("password must be 8 - 30 characters long"));
    }

    // password must contain atleast one special character.
    {
      let mut specialCharacterCount: u8 = 0;

      password.chars().for_each(|character: char| {
        if !character.is_alphanumeric() {
          specialCharacterCount += 1;
        }
      });

      if specialCharacterCount == 0 {
        return Err(String::from(
          "password must contain atleast 1 special character",
        ));
      }
    }

    Ok(())
  }
}
