resource "aws_iam_role" "cluster_autoscaler" {
  name = "cluster-autoscaler-${var.environment}"
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
            "${var.oidc_issuer_host}:sub" = "system:serviceaccount:cluster-autoscaler:cluster-autoscaler"
            "${var.oidc_issuer_host}:aud" = "sts.amazonaws.com"
          }
        }
      }
    ]
  })
}

data "aws_iam_policy_document" "cluster_autoscaler" {
  statement {
    effect = "Allow"
    actions = [
      "autoscaling:DescribeAutoScalingGroups",
      "autoscaling:DescribeAutoScalingInstances",
      "autoscaling:DescribeLaunchConfigurations",
      "autoscaling:DescribeScalingActivities",
      "ec2:DescribeImages",
      "ec2:DescribeInstanceTypes",
      "ec2:DescribeLaunchTemplateVersions",
      "ec2:GetInstanceTypesFromInstanceRequirements",
    ]
    resources = ["*"]
  }

  statement {
    effect = "Allow"
    actions = [
      "autoscaling:SetDesiredCapacity",
      "autoscaling:TerminateInstanceInAutoScalingGroup",
    ]
    resources = ["*"]

    condition {
      test     = "StringLike"
      variable = "autoscaling:ResourceTag/project"
      values   = ["openmedia"]
    }

    condition {
      test     = "StringLike"
      variable = "autoscaling:ResourceTag/environment"
      values   = [var.environment]
    }
  }
}

resource "aws_iam_role_policy" "cluster_autoscaler" {
  name = "cluster-autoscaler"
  role = aws_iam_role.cluster_autoscaler.id

  policy = data.aws_iam_policy_document.cluster_autoscaler.json
}
