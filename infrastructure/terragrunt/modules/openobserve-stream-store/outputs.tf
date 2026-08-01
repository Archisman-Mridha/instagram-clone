output "name" {
  description = "OpenObserve stream store name"
  value       = aws_s3_bucket.openobserve_stream_store.bucket
}

output "arn" {
  description = "OpenObserve stream store ARN"
  value       = aws_s3_bucket.openobserve_stream_store.arn
}
