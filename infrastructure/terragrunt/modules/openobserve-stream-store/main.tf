resource "aws_s3_bucket" "openobserve_stream_store" {
  bucket           = "openobserve-stream-store-${var.environment}-openmedia"
  bucket_namespace = "global"
}
