use crate::{
  domain::usecases::Usecases,
  proto::{
    profiles_service_server::{ProfilesService, ProfilesServiceServer},
    *,
  },
  CONFIG, THREAD_CANCELLATION_TOKEN,
};
use async_trait::async_trait;
use autometrics::{autometrics, objectives::Objective};
use shared::utils::{
  mapToGrpcError,
  observability::{linkParentTrace, makeSpan},
};
use tokio::spawn;
use tonic::{codec::CompressionEncoding, transport::Server, Request, Response, Status};
use tower::ServiceBuilder;
use tower_http::trace::TraceLayer;
use tracing::{debug, instrument};

const MAX_REQUEST_SIZE: usize = 512; //bytes

pub struct GrpcAdapter {}

impl GrpcAdapter {
  // startServer starts a gRPC server.
  pub async fn startServer(usecases: &'static Usecases) {
    let address = format!("[::]:{}", &*CONFIG.GRPC_SERVER_PORT);
    let address = address.parse().expect(&format!(
      "ERROR: Parsing binding address of the gRPC server : {}",
      address
    ));

    let profilesService = ProfilesServiceServer::new(ProfilesServiceImpl { usecases })
      .max_decoding_message_size(MAX_REQUEST_SIZE)
      .send_compressed(CompressionEncoding::Gzip)
      .accept_compressed(CompressionEncoding::Gzip);

    let reflectionService = tonic_reflection::server::Builder::configure()
      .register_encoded_file_descriptor_set(FILE_DESCRIPTOR_SET)
      .build()
      .expect("ERROR: Building gRPC reflection service")
      .max_decoding_message_size(MAX_REQUEST_SIZE);

    debug!("Starting gRPC server");

    spawn(async move {
      Server::builder()
        .layer(
          ServiceBuilder::new()
            .layer(TraceLayer::new_for_grpc().make_span_with(makeSpan))
            .map_request(linkParentTrace),
        )
        .add_service(profilesService)
        .add_service(reflectionService)
        .serve_with_shutdown(address, THREAD_CANCELLATION_TOKEN.clone().cancelled())
        .await
        .expect("ERROR: Starting gRPC server");
    });
  }
}

struct ProfilesServiceImpl {
  usecases: &'static Usecases,
}

const API_SLO: Objective = Objective::new("profiles-microservice");

#[autometrics(objective = API_SLO)]
#[async_trait]
impl ProfilesService for ProfilesServiceImpl {
  async fn ping(&self, _: Request<()>) -> Result<Response<()>, Status> {
    Ok(Response::new(()))
  }

  #[instrument(skip(self), level = "info")]
  async fn search_profiles(
    &self,
    request: Request<SearchProfilesRequest>,
  ) -> Result<Response<SearchProfilesResponse>, Status> {
    let request = request.into_inner();

    self
      .usecases
      .searchProfiles(&request.query)
      .await
      .map(|profilePreviews| {
        Response::new(SearchProfilesResponse {
          profile_previews: profilePreviews,
        })
      })
      .map_err(mapToGrpcError)
  }

  #[instrument(skip(self), level = "info")]
  async fn get_profile_previews(
    &self,
    request: Request<GetProfilePreviewsRequest>,
  ) -> Result<Response<GetProfilePreviewsResponse>, Status> {
    let request = request.into_inner();

    self
      .usecases
      .getProfilePreviews(request.ids)
      .await
      .map(|profilePreviews| {
        Response::new(GetProfilePreviewsResponse {
          profile_previews: profilePreviews,
        })
      })
      .map_err(mapToGrpcError)
  }
}
