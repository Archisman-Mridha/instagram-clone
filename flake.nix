{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";

    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs = {
        nixpkgs.follows = "nixpkgs";
        flake-utils.follows = "flake-utils";
      };
    };

    foundry.url = "github:shazow/foundry.nix/monthly";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      rust-overlay,
      foundry,
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

        projectRootPath = ./.;
      in
      with pkgs;
      {
        devShells.default = mkShell {
          nativeBuildInputs = [
            (rust-bin.fromRustupToolchainFile ./backend/gateway/rust-toolchain.toml)
          ];

          buildInputs =
            let
              protoc-gen-grafbase-subgraph = pkgs.stdenv.mkDerivation rec {
                pname = "protoc-gen-grafbase-subgraph";
                version = "0.1.1";

                src = pkgs.fetchurl {
                  url =
                    "https://github.com/grafbase/grafbase/releases/download/protoc-gen-grafbase-subgraph-${version}/protoc-gen-grafbase-subgraph-"
                    + (
                      if pkgs.stdenv.isDarwin then "aarch64-apple-darwin.tar.gz" else "x86_64-unknown-linux-musl.tar.gz"
                    );

                  sha256 = "sha256-2XRrkh5LjX/hVU/HJQuWqkivqiK0gdXdjJCOT+y7a2M=";
                };

                unpackPhase = ''
                  tar -xzf $src
                '';
                installPhase = ''
                  mkdir -p $out/bin
                  cp protoc-gen-grafbase-subgraph $out/bin/protoc-gen-grafbase-subgraph
                  chmod +x $out/bin/protoc-gen-grafbase-subgraph
                '';
              };
            in
            [
              go_1_24
              golangci-lint
              golines

              protobuf
              buf

              sqlc

              llvm
              rustup
              (rust-bin.fromRustupToolchainFile ./backend/gateway/rust-toolchain.toml)

              protoc-gen-grafbase-subgraph

              foundry-bin
              solc

              bun
              biome

              cue
              docker-compose
              kubectl
              kubeseal
              awscli2

              go-task
            ];
        };

        packages =
          let
            microserviceNames = [
              "users"
              "profiles"
              "followships"
              "posts"
              "feeds"
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
