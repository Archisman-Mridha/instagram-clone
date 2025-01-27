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
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      rust-overlay,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        overlays = [ (import rust-overlay) ];
        pkgs = import nixpkgs {
          inherit system overlays;
          config.allowUnfree = true;
        };
        rootPath = ./.;
      in
      with pkgs;
      {
        nativeBuildInputs = [
          (rust-bin.fromRustupToolchainFile ./rust-toolchain.toml)
        ];

        devShells.default = mkShell {
          buildInputs = [
            go
            golangci-lint
            golines

            protobuf
            buf

            llvm
            rustup
            (rust-bin.fromRustupToolchainFile ./rust-toolchain.toml)

            nixfmt-rfc-style

            gnumake
          ];
        };

        packages =
          let
            version = "v1.0.0";
            microservices = [
              "users"
              "posts"
            ];
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
