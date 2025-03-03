{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";

    foundry.url = "github:shazow/foundry.nix/monthly";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      foundry,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        overlays = [
          foundry.overlay
        ];
        pkgs = import nixpkgs {
          inherit system overlays;
          config.allowUnfree = true;
        };
        projectRootPath = ./.;
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

            sqlc

            foundry-bin
            solc

            bun
            biome

            cue
            docker-compose
            kubectl
            kubeseal
            awscli2

            gnumake
          ];

          shellHook = "export PS1=\"(dev) $PS1\"";
        };

        packages =
          let
            microserviceNames = [
              "users"
              "posts"
            ];
          in
          {
            microservices = lib.listToAttrs (
              map (microservice: {
                name = microserviceName;
                value = (import ./build/nix/go.nix).microservice {
                  inherit
                    lib
                    buildGoModule
                    dockerTools
                    projectRootPath
                    ;
                  name = microserviceName;
                };
              }) microserviceNames
            );
          };
      }
    );
}
