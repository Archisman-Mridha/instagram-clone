use {anyhow::Result, serde::Deserialize, std::fs};

#[derive(Debug, Deserialize)]
pub struct Config {
  // A sub-graph will be constructed from each source (/ API).
  pub sources: Vec<Source>,
}

#[derive(Debug, Deserialize)]
#[serde(tag = "type")]
pub enum Source {
  #[serde(rename = "gRPC")]
  GRPCSource(GRPCSource),
}

#[derive(Debug, Deserialize)]
pub struct GRPCSource {
  name: String,

  // Path to the proto file.
  protoFile: String,
}

impl Config {
  // Tries to read and parse the content of the given config file.
  // Returns the parse result.
  pub fn parseFromFile(configFilePath: &str) -> Result<Self> {
    let unparsedConfig = fs::read_to_string(configFilePath)?;
    Self::parse(&unparsedConfig)
  }

  // Tries to parse the given string into a Config struct instance.
  // Returns the parse result.
  pub fn parse(unparsedConfig: &str) -> Result<Self> {
    Ok(serde_yaml::from_str(unparsedConfig)?)
  }
}

#[cfg(test)]
mod test {
  use super::*;

  #[test]
  fn test_parse() {
    let unparsedConfig = "
      sources:
        - name: users-microservice
          type: gRPC
          protoFile: ./proto/users/v1/v1.proto
    ";

    let _config = Config::parse(unparsedConfig).unwrap();
  }
}
