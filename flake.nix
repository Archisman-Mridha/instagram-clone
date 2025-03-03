{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";

    foundry.url = "github:shazow/foundry.nix/monthly";

    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs = {
        nixpkgs.follows = "nixpkgs";
      };
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      foundry,
      rust-overlay,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        overlays = [
          (import rust-overlay)
          foundry.overlay
        ];

        pkgs = import nixpkgs {
          inherit system overlays;
          config.allowUnfree = true;
        };

        cargo-expand = pkgs.cargo-expand.overrideAttrs (oldAttrs: {
          src = pkgs.fetchFromGitHub {
            owner = "dtolnay";
            repo = "cargo-expand";
            rev = "a1945f760a8fe019a4d753808de424dcd4e5b3cf";
            sha256 = "";
          };
        });

        projectRootPath = ./.;
        rustToolchainFilePath = projectRootPath + /backend/rust-toolchain.toml;
      in
      with pkgs;
      {
        nativeBuildInputs = [
          (rust-bin.fromRustupToolchainFile rustToolchainFilePath)
        ];

        devShells.default = mkShell {
          buildInputs = [
            go
            golangci-lint
            golines

            protobuf
            buf

            sqlc

            llvm
            rustup
            (rust-bin.fromRustupToolchainFile rustToolchainFilePath)
            cargo-expand

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
