resource "aws_iam_role" "openobserve" {
  name = "openobserve-${var.environment}"
  path = "/openmedia/${var.environment}/"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Federated = local.oidc_provider_arn }
        Action    = "sts:AssumeRoleWithWebIdentity"

        Condition = {
          StringEquals = {
            "${var.oidc_issuer_host}:sub" = "system:serviceaccount:openobserve:openobserve"
            "${var.oidc_issuer_host}:aud" = "sts.amazonaws.com"
          }
        }
      }
    ]
  })
}

data "aws_iam_policy_document" "openobserve" {
  statement {
    effect    = "Allow"
    actions   = ["s3:ListBucket"]
    resources = [var.openobserve_stream_store_arn]
  }

  statement {
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:DeleteObject",
    ]
    resources = ["${var.openobserve_stream_store_arn}/*"]
  }
}

resource "aws_iam_role_policy" "openobserve" {
  name = "openobserve"
  role = aws_iam_role.openobserve.id

  policy = data.aws_iam_policy_document.openobserve.json
}
