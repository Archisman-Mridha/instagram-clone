{
  microservice =
    {
      lib,
      buildGoModule,
      dockerTools,
      projectRoot,
      name,
      ...
    }:
    let
      architectures = [
        "amd64"
        "arm64"
      ];
    in
    lib.listToAttrs (
      map (architecture: {
        name = architecture;
        value =
          let
            microserviceRootPath = (projectRoot + /backend/microservices + name);

            versionFilePath = (microserviceRootPath + /version/.version);
            version = builtins.readFile versionFilePath;

            binary = buildGoModule {
              pname = name;
              inherit version;
              src = microserviceRootPath;
              subPackages = [ "cmd/server/grpc" ];
              env = {
                CGO_ENABLED = 0;
                GOOS = "linux";
                GOARCH = architecture;
              };
              vendorHash = null;
            };
          in
          {
            container-image = dockerTools.buildLayeredImage {
              name = "archismanmridha/${name}-microservice";
              tag = version;
              inherit architecture;
              config.Cmd = [ "${binary}/bin/server" ];
            };
          };
      }) architectures
    );
}
