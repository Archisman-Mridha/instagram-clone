resource "aws_s3_bucket" "irsa_discovery_store" {
  bucket           = "irsa-discovery-store-${var.environment}-openmedia"
  bucket_namespace = "global"
}

resource "aws_s3_bucket_public_access_block" "irsa_discovery_store" {
  bucket = aws_s3_bucket.irsa_discovery_store.id

  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "irsa_discovery_store" {
  bucket = aws_s3_bucket.irsa_discovery_store.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.irsa_discovery_store.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.irsa_discovery_store]
}
