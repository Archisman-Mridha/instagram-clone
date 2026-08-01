resource "aws_key_pair" "creator" {
  key_name   = local.creator_ssh_key_name
  public_key = var.creator_ssh_public_key
}

resource "aws_s3_bucket" "kops_state_store" {
  bucket           = "kops-state-store.openmedia"
  bucket_namespace = "global"
}

resource "aws_s3_bucket_versioning" "kops_state_store" {
  bucket = aws_s3_bucket.kops_state_store.id

  versioning_configuration {
    status = "Enabled"
  }
}
