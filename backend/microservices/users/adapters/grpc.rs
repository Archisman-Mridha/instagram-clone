use crate::{proto::{users_service_server::*, *}, THREAD_CANCELLATION_TOKEN, CONFIG, domain::usecases::Usecases};
use autometrics::{autometrics, objectives::Objective};
use shared::utils::{mapToGrpcError, distributedTracing::{makeSpan, linkParentTrace}};
use tokio::spawn;
use tonic::{codec::CompressionEncoding, transport::Server, Request, Response, Status, async_trait};
use tower::ServiceBuilder;
use tracing::instrument;
use tower_http::trace::TraceLayer;

const MAX_REQUEST_SIZE: usize= 512; // 512 Bytes

pub struct GrpcAdapter { }

impl GrpcAdapter {
  pub async fn startServer(usecases: Box<Usecases>) {
    let address= format!("[::]:{}", CONFIG.GRPC_SERVER_PORT);
    let address= address.parse( )
												.expect(&format!("ERROR: Parsing binding address of the gRPC server : {}", address));

    let usersService=
			UsersServiceServer::new(UsersServiceImpl { usecases })
				.max_decoding_message_size(MAX_REQUEST_SIZE)
				.send_compressed(CompressionEncoding::Gzip)
				.accept_compressed(CompressionEncoding::Gzip);

    let reflectionService=
			tonic_reflection::server::Builder::configure( )
				.register_encoded_file_descriptor_set(FILE_DESCRIPTOR_SET)
				.build( )
				.expect("ERROR: Building gRPC reflection service")
				.max_decoding_message_size(MAX_REQUEST_SIZE);

    println!("INFO: Starting gRPC server");

    spawn(async move {
      Server::builder( )
				.layer(
					ServiceBuilder::new( )
						.layer(TraceLayer::new_for_grpc( ).make_span_with(makeSpan))
						.map_request(linkParentTrace)
				)
        .add_service(usersService)
        .add_service(reflectionService)
        .serve_with_shutdown(address, THREAD_CANCELLATION_TOKEN.clone( ).cancelled( ))
        .await
        .expect("ERROR: Starting gRPC server");
    });
  }
}

struct UsersServiceImpl {
	usecases: Box<Usecases>
}

// Service Level Objectives (SLOs) are a way to define and measure the reliability and performance
// of a service.
// Autometrics raises an alert whenever any of the SLO objectives fail.
const API_SLO: Objective= Objective::new("users-microservice");

#[autometrics(objective = API_SLO)]
#[async_trait]
impl UsersService for UsersServiceImpl {
	async fn ping(&self, _: Request<( )>) -> Result<Response<( )>, Status> {
		Ok(Response::new(( )))}

	#[instrument(skip(self))]
  async fn signup(&self, request: Request<SignupRequest>) -> Result<Response<AuthenticationResponse>, Status> {
    let request= request.into_inner( );

    self.usecases.signup(&request).await
								 .map(|value| Response::new(AuthenticationResponse { jwt: value.jwt }))
								 .map_err(mapToGrpcError)
  }

	#[instrument(skip(self))]
  async fn signin(&self, request: Request<SigninRequest>) -> Result<Response<AuthenticationResponse>, Status> {
    let request= request.into_inner( );

    self.usecases.signin(&request).await
								 .map(|value| Response::new(AuthenticationResponse { jwt: value.jwt }))
								 .map_err(mapToGrpcError)
  }

	#[instrument(skip(self))]
  async fn verify_jwt(&self, request: Request<VerifyJwtRequest>) -> Result<Response<VerifyJwtResponse>, Status> {
    let request= request.into_inner( );

    self.usecases.verifyJwt(&request.jwt).await
								 .map(|value| Response::new(VerifyJwtResponse { user_id: value }))
								 .map_err(mapToGrpcError)
  }
}