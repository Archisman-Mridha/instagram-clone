use rand::Rng;

pub struct OTPGenerator { }

impl OTPGenerator {

    pub fn generate( ) -> String {
        return rand::thread_rng( )
            .gen_range(100000..999999)
            .to_string( );
    }
}