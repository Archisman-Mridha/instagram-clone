use mockall::automock;

use crate::Domain::ValueObjects::TemporaryUserRecord;

#[automock]
pub trait TemporaryUserRecordsRepositoryPort {

    fn getByEmail(&self, email: &String) -> Result<Option<TemporaryUserRecord>, ( )>;
    fn getByUsername(&self, username: &String) -> Result<Option<TemporaryUserRecord>, ( )>;
    fn save(&self, record: &TemporaryUserRecord) -> Result<( ), ( )>;

}