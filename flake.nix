{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    pre-commit-hooks.url = "github:cachix/git-hooks.nix";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      pre-commit-hooks,
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

            nixfmt-rfc-style

            gnumake
          ] ++ self.checks.${system}.pre-commit-check.enabledPackages;

          inherit (self.checks.${system}.pre-commit-check) shellHook;
        };

        checks = {
          pre-commit-check = pre-commit-hooks.lib.${system}.run {
            src = ./.;
            hooks = {
              gofmt.enable = true;
              golangci-lint = {
                enable = true;
                extraPackages = [ go ];
              };
              gotest.enable = true;

              nixfmt-rfc-style.enable = true;
            };
          };
        };

        packages =
          let
            version = "v1.0.0";
            microservices = [ "auth" ];
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
