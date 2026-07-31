{
  description = "OpenMedia development environment";

  inputs = {
    nixpkgs.url = "github:cachix/devenv-nixpkgs/rolling";
    nixpkgs-25_11.url = "github:NixOS/nixpkgs/nixos-25.11";
    systems.url = "github:nix-systems/default";
    devenv = {
      url = "github:cachix/devenv";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  nixConfig = {
    extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs =
    {
      self,
      nixpkgs,
      nixpkgs-25_11,
      systems,
      devenv,
      ...
    }@inputs:
    let
      forEachSystem = nixpkgs.lib.genAttrs (import systems);
    in
    {
      devShells = forEachSystem (
        system:
        let
          pkgs = import nixpkgs {
            inherit system;
            config.allowUnfree = true;
          };
        in
        {
          default = devenv.lib.mkShell {
            inherit inputs pkgs;
            modules = [
              {
                # Most packages come pre-built with binaries provided by the official Nix binary
                # cache.
                # If you're modifying a package or using a package that's not built upstream, Nix
                # will build it from source instead of downloading a binary.
                # To prevent packages from being built more than once, devenv provides seamless
                # integration with binary caches hosted by Cachix.
                cachix.enable = true;

                packages = with pkgs; [
                  bun

                  terraform
                  terragrunt
                  tflint

                  # Tanka only supports Helm v3. It feeds every repository from chartfile.yaml
                  # (including the oci:// ones) into 'helm repo update', which Helm v4 rejects,
                  # making 'tk tool charts vendor' fail.
                  # This issue is being tracked upstream in grafana/tanka#1749.
                  # nixos-25.11 is the most recent nixpkgs branch still shipping Helm v3.
                  (import inputs.nixpkgs-25_11 { inherit system; }).kubernetes-helm
                  k3d
                  kops
                  tanka
                  go-jsonnet
                  jsonnet-bundler
                  kubeseal
                  karmor

                  sqlfluff
                  hadolint
                  yamlfmt
                  statix
                  cocogitto

                  prek
                ];

                env = {
                  KOPS_STATE_STORE = "s3://kops-state-store.openmedia";
                };

                enterShell = ''
                  export KUBECONFIG="$(pwd)/infrastructure/kubernetes/kubeconfig.yaml"

                  prek install
                '';
              }
            ];
          };
        }
      );
    };
}
