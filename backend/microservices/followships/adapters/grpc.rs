use crate::{
  domain::usecases::Usecases,
  proto::{followships_service_server::*, *},
  CONFIG, THREAD_CANCELLATION_TOKEN,
};
use async_trait::async_trait;
use autometrics::{autometrics, objectives::Objective};
use shared::utils::mapToGrpcError;
use tokio::spawn;
use tonic::{codec::CompressionEncoding, transport::Server, Request, Response, Status};

const MAX_REQUEST_SIZE: usize= 512; //bytes

pub struct GrpcAdapter { }

impl GrpcAdapter {
  // startServer starts a gRPC server.
  pub async fn startServer(usecases: Box<Usecases>) {
    let address= format!("[::]:{}", &*CONFIG.GRPC_SERVER_PORT);
    let address= address.parse( )
												.expect(&format!("ERROR: parsing binding address of the gRPC server : {}", address));

    let followshipsService=
			FollowshipsServiceServer::new(FollowshipsServiceImpl { usecases })
				.max_decoding_message_size(MAX_REQUEST_SIZE)
				.send_compressed(CompressionEncoding::Gzip)
				.accept_compressed(CompressionEncoding::Gzip);

    let reflectionService=
			tonic_reflection::server::Builder::configure( )
				.register_encoded_file_descriptor_set(FILE_DESCRIPTOR_SET)
				.build( )
				.expect("ERROR: building gRPC reflection service")
				.max_decoding_message_size(MAX_REQUEST_SIZE);

    println!("INFO: Starting gRPC server");

    spawn(async move {
      Server::builder( )
        .add_service(followshipsService)
        .add_service(reflectionService)
        .serve_with_shutdown(address, THREAD_CANCELLATION_TOKEN.clone( ).cancelled( ))
        .await
        .expect("ERROR: starting gRPC server");
    });
  }
}

struct FollowshipsServiceImpl {
  usecases: Box<Usecases>
}

const API_SLO: Objective= Objective::new("users-microservice");

#[autometrics(objective = API_SLO)]
#[async_trait]
impl FollowshipsService for FollowshipsServiceImpl {
	async fn ping(&self, _: Request<( )>) -> Result<Response<( )>, Status> {
		Ok(Response::new(( )))}

	async fn follow(&self, request: Request<FollowshipOperationRequest>) -> Result<Response<( )>, Status> {
		let request= request.into_inner( );

		self.usecases.follow(&request).await
								 .map(|_| Response::new(( )))
								 .map_err(mapToGrpcError)
	}

	async fn unfollow(&self, request: Request<FollowshipOperationRequest>) -> Result<Response<( )>, Status> {
		let request= request.into_inner( );

		self.usecases.unfollow(&request).await
								 .map(|_| Response::new(( )))
								 .map_err(mapToGrpcError)
	}

	async fn does_followship_exist(&self, request: Request<DoesFollowshipExistRequest>) -> Result<Response<DoesFollowshipExistResponse>, Status> {
		let request= request.into_inner( );

		self.usecases.doesFollowshipExist(&request).await
								 .map(|value| Response::new(DoesFollowshipExistResponse { exists: value }))
								 .map_err(mapToGrpcError)
	}

	async fn get_followers(&self, request: Request<GetFollowersRequest>) -> Result<Response<GetFollowersResponse>, Status> {		let request= request.into_inner( );

		self.usecases.getFollowers(&request).await
								 .map(|value| Response::new(value))
								 .map_err(mapToGrpcError)
	}


	async fn get_followings(&self, request: Request<GetFollowingsRequest>) -> Result<Response<GetFollowingsResponse>, Status> {
		let request= request.into_inner( );
		self.usecases.getFollowings(&request).await
								 .map(|value| Response::new(value))
								 .map_err(mapToGrpcError)
	}


	async fn get_followship_counts(&self, request: Request<GetFollowshipCountsRequest>) -> Result<Response<GetFollowshipCountsResponse>, Status> {
		let request= request.into_inner( );
		self.usecases.getFollowshipCounts(request.user_id).await
								 .map(|value| Response::new(value))
								 .map_err(mapToGrpcError)
	}
}