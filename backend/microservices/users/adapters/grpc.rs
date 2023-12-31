use crate::{proto::{users_service_server::*, *}, THREAD_CANCELLATION_TOKEN, SERVER_ERROR};
use tokio::spawn;
use tonic::{codec::CompressionEncoding, transport::Server, Request, Response, Status, async_trait, Code};

const MAX_REQUEST_SIZE: usize= 512; // 512 Bytes

pub struct GrpcAdapter { }

impl GrpcAdapter {
  pub async fn startServer( ) {
    let address= "[::]:4000";
    let address= address.parse( )
												.expect(&format!("ERROR: Parsing binding address of the gRPC server : {}", address));

    let usersService=
			UsersServiceServer::new(UsersServiceImpl { })
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
        .add_service(usersService)
        .add_service(reflectionService)
        .serve_with_shutdown(address, THREAD_CANCELLATION_TOKEN.clone( ).cancelled( ))
        .await
        .expect("ERROR: Starting gRPC server");
    });
  }
}

struct UsersServiceImpl { }

#[async_trait]
impl UsersService for UsersServiceImpl {

  async fn signup(&self, request: Request<SignupRequest>) -> Result<Response<AuthenticationResponse>, Status> {
		unimplemented!( )}

  async fn signin(&self, request: Request<SigninRequest>) -> Result<Response<AuthenticationResponse>, Status> {
		unimplemented!( )}

  async fn verify_jwt(&self, request: Request<VerifyJwtRequest>) -> Result<Response<VerifyJwtResponse>, Status> {
		unimplemented!( )}
}

// mapToGrpcError takes an anyhow error, analyses the actual underlying error and returns an
// appropriate gRPC status code.
fn mapToGrpcError(error: anyhow::Error) -> Status {
	let errorAsString= error.to_string( );

	let grpcErrorCode= {
		if errorAsString.eq(SERVER_ERROR) { Code::Internal }
		else { Code::InvalidArgument }
	};

	Status::new(grpcErrorCode, errorAsString)
}