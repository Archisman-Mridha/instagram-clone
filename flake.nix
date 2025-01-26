{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };
        rootPath = ./.;
      in
      with pkgs;
      {
        devShells.default = mkShell {
          buildInputs = [
            go
            golangci-lint
            golines

            protobuf
            buf

            /*
              llvm
              wasmedge
            */

            nixfmt-rfc-style

            gnumake
          ];
        };

        packages =
          let
            version = "v1.0.0";
            microservices = [ "users" ];
          in
          {
            microservices = lib.listToAttrs (
              map (microservice: {
                name = microservice;
                value = (import ./build/nix/go.nix) {
                  inherit
                    lib
                    buildGoModule
                    dockerTools
                    rootPath
                    version
                    ;
                  microservice = "${microservice}-microservice";
                };
              }) microservices
            );
          };
      }
    );
}
