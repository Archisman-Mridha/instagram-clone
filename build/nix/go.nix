{ lib, buildGoModule, dockerTools, version, rootPath, microservice, ... }:
let
  architectures = [ "amd64" "arm64" ];
in lib.listToAttrs(map (architecture: {
  name = architecture;
  value =
    let
      binary = buildGoModule {
        pname = microservice;
        inherit version;
        src = rootPath + /backend/microservices/auth;
        subPackages = [ "cmd/server" ];
        env = {
          CGO_ENABLED = 0;
          GOOS = "linux";
          GOARCH = architecture;
        };
        vendorHash = null;
      };
    in {
      container-image = dockerTools.buildLayeredImage {
        name = "archismanmridha/${microservice}";
        tag = version;
        config.Cmd = [ "${binary}/bin/server" ];
        inherit architecture;
      };
    };
}) architectures)
