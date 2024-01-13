use crate::{
  domain::usecases::Usecases,
  proto::{posts_service_server::*, *},
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
  pub async fn startServer(usecases: Box<Usecases>) {
    let address = format!("[::]:{}", &*CONFIG.GRPC_SERVER_PORT);
    let address = address.parse().expect(&format!(
      "ERROR: Parsing binding address of the gRPC server : {}",
      address
    ));

    let postsService = PostsServiceServer::new(PostsServiceImpl { usecases })
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
        .add_service(postsService)
        .add_service(reflectionService)
        .serve_with_shutdown(address, THREAD_CANCELLATION_TOKEN.clone().cancelled())
        .await
        .expect("ERROR: Starting gRPC server");
    });
  }
}

struct PostsServiceImpl {
  usecases: Box<Usecases>,
}

const API_SLO: Objective = Objective::new("posts-microservice");

#[autometrics(objective = API_SLO)]
#[async_trait]
impl PostsService for PostsServiceImpl {
  async fn ping(&self, _: Request<()>) -> Result<Response<()>, Status> {
    Ok(Response::new(()))
  }

  #[instrument(skip(self), level = "info")]
  async fn create_post(
    &self,
    request: Request<CreatePostRequest>,
  ) -> Result<Response<CreatePostResponse>, Status> {
    let request = request.into_inner();

    self
      .usecases
      .createPost(request)
      .await
      .map(|postId| Response::new(CreatePostResponse { post_id: postId }))
      .map_err(mapToGrpcError)
  }

  #[instrument(skip(self), level = "info")]
  async fn get_posts_of_user(
    &self,
    request: Request<GetPostsOfUserRequest>,
  ) -> Result<Response<GetPostsResponse>, Status> {
    let request = request.into_inner();

    self
      .usecases
      .getPostsOfUser(request)
      .await
      .map(|posts| Response::new(GetPostsResponse { posts }))
      .map_err(mapToGrpcError)
  }

  #[instrument(skip(self), level = "info")]
  async fn get_posts(
    &self,
    request: Request<GetPostsRequest>,
  ) -> Result<Response<GetPostsResponse>, Status> {
    let request = request.into_inner();

    self
      .usecases
      .getPosts(request.post_ids)
      .await
      .map(|posts| Response::new(GetPostsResponse { posts }))
      .map_err(mapToGrpcError)
  }
}
