use crate::{
	domain::usecases::Usecases,
	CONFIG, THREAD_CANCELLATION_TOKEN,
	proto::{*, profiles_service_server::{ProfilesServiceServer, ProfilesService}}
};
use async_trait::async_trait;
use shared::utils::mapToGrpcError;
use tokio::spawn;
use tonic::{transport::Server, codec::CompressionEncoding, Request, Response, Status};

const MAX_REQUEST_SIZE: usize= 512; //bytes

pub struct GrpcAdapter { }

impl GrpcAdapter {
  // startServer starts a gRPC server.
  pub async fn startServer(usecases: &'static Usecases) {
    let address= format!("[::]:{}", &*CONFIG.GRPC_SERVER_PORT);
    let address= address.parse( )
												.expect(&format!("ERROR: parsing binding address of the gRPC server : {}", address));

	let profilesService=
		ProfilesServiceServer::new(ProfilesServiceImpl { usecases })
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
				.add_service(profilesService)
        .add_service(reflectionService)
        .serve_with_shutdown(address, THREAD_CANCELLATION_TOKEN.clone( ).cancelled( ))
        .await
        .expect("ERROR: starting gRPC server");
    });
  }
}

struct ProfilesServiceImpl {
  usecases: &'static Usecases
}

#[async_trait]
impl ProfilesService for ProfilesServiceImpl {

	async fn search_profiles(&self, request: Request<SearchProfilesRequest>) -> Result<Response<SearchProfilesResponse>, Status> {
		let request= request.into_inner( );

    self.usecases.searchProfiles(&request.query).await
								 .map(|profilePreviews| Response::new(SearchProfilesResponse { profile_previews: profilePreviews }))
								 .map_err(mapToGrpcError)
	}

	async fn get_profile_previews(&self, request: Request<GetProfilePreviewsRequest>) -> Result<Response<GetProfilePreviewsResponse>, Status> {
		let request= request.into_inner( );

		self.usecases.getProfilePreviews(request.ids).await
								 .map(|profilePreviews| Response::new(GetProfilePreviewsResponse { profile_previews: profilePreviews }))
								 .map_err(mapToGrpcError)
	}
}