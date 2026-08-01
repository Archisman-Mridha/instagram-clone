output "regional_domain_name" {
  description = "Regional domain name of the IRSA discovery store"
  value       = aws_s3_bucket.irsa_discovery_store.bucket_regional_domain_name
}
