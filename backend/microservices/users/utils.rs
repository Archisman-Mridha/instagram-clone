use anyhow::{anyhow, Result};
use argon2::{
  password_hash::{rand_core::OsRng, SaltString},
  Argon2, PasswordHash, PasswordHasher, PasswordVerifier,
};
use shared::utils::SERVER_ERROR;
use tracing::error;

pub fn hashPassword(password: &str) -> Result<String> {
  Argon2::default()
    .hash_password(password.as_bytes(), &SaltString::generate(&mut OsRng))
    .map(|value| value.to_string())
    .map_err(|error| {
      error!("Unexpected server error occurred : {}", error);
      anyhow!(SERVER_ERROR)
    })
}

pub fn verifyPassword(password: &str, hashedPassword: &str) -> Result<bool> {
  let parsedHashedPassword = PasswordHash::new(hashedPassword).map_err(|error| {
    error!("Unexpected server error occurred : {}", error);
    anyhow!(SERVER_ERROR)
  })?;
  let result = Argon2::default().verify_password(password.as_bytes(), &parsedHashedPassword);

  Ok(result.is_ok())
}

pub mod jwt {
  use crate::CONFIG;
  use anyhow::{anyhow, Result};
  use chrono::Local;
  use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
  use lazy_static::lazy_static;
  use serde::{Deserialize, Serialize};
  use shared::utils::toServerError;

  // The JWT is structured as a set of claims (JSON key-value pairs) that provide information about
  // the entity. There are three types of claims: Registered, Public and Private.
  #[derive(Debug, Serialize, Deserialize)]
  struct JwtClaims {
    // Registered Claims - standardized by the community.
    sub: String,
    issuedAt: usize,
    exp: usize,
    // Public and Private Claims.
  }

  impl JwtClaims {
    fn new(sub: String) -> Self {
      let currentTimestamp = Local::now().timestamp() as usize;

      Self {
        sub,
        issuedAt: currentTimestamp,
        exp: currentTimestamp + (60 * 60 * 12), // JWT expires after 12 hours.
      }
    }
  }

  lazy_static! {
    static ref JWT_ENCODING_KEY: EncodingKey =
      EncodingKey::from_secret(CONFIG.JWT_SECRET.as_bytes());
    static ref JWT_DECODING_KEY: DecodingKey =
      DecodingKey::from_secret(CONFIG.JWT_SECRET.as_bytes());
  }

  pub fn createJwt(id: String) -> Result<String> {
    let claims = JwtClaims::new(id);
    encode(&Header::default(), &claims, &JWT_ENCODING_KEY).map_err(toServerError)
  }

  pub fn decodeJwt(jwt: &str) -> Result<String> {
    let tokenData =
      decode::<JwtClaims>(jwt, &JWT_DECODING_KEY, &Validation::default()).map_err(toServerError)?;
    let claims = tokenData.claims;

    if claims.exp < Local::now().timestamp() as usize {
      return Err(anyhow!("JWT expired"));
    }

    Ok(claims.sub)
  }
}
