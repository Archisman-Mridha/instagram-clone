use crate::{
  domain::usecases::Usecases,
  proto::{feeds_service_server::*, *},
  CONFIG, THREAD_CANCELLATION_TOKEN,
};
use autometrics::{autometrics, objectives::Objective};
use shared::utils::{
  mapToGrpcError,
  observability::{linkParentTrace, makeSpan},
};
use tokio::spawn;
use tonic::{
  async_trait, codec::CompressionEncoding, transport::Server, Request, Response, Status,
};
use tower::ServiceBuilder;
use tower_http::trace::TraceLayer;
use tracing::{debug, instrument};

const MAX_REQUEST_SIZE: usize = 512; // 512 Bytes

pub struct GrpcAdapter {}

impl GrpcAdapter {
  pub async fn startServer(usecases: &'static Usecases) {
    let address = format!("[::]:{}", CONFIG.GRPC_SERVER_PORT);
    let address = address.parse().expect(&format!(
      "ERROR: Parsing binding address of the gRPC server : {}",
      address
    ));

    let feedsService = FeedsServiceServer::new(FeedsServiceImpl { usecases })
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
        .add_service(feedsService)
        .add_service(reflectionService)
        .serve_with_shutdown(address, THREAD_CANCELLATION_TOKEN.clone().cancelled())
        .await
        .expect("ERROR: Starting gRPC server");
    });
  }
}

struct FeedsServiceImpl {
  usecases: &'static Usecases,
}

const API_SLO: Objective = Objective::new("feeds-microservice");

#[autometrics(objective = API_SLO)]
#[async_trait]
impl FeedsService for FeedsServiceImpl {
  async fn ping(&self, _: Request<()>) -> Result<Response<()>, Status> {
    Ok(Response::new(()))
  }

  #[instrument(skip(self), level = "info")]
  async fn get_feed(
    &self,
    request: Request<GetFeedRequest>,
  ) -> Result<Response<GetFeedResponse>, Status> {
    let request = request.into_inner();

    self
      .usecases
      .getFeed(request)
      .map(|value| Response::new(GetFeedResponse { post_ids: value }))
      .map_err(mapToGrpcError)
  }
}
