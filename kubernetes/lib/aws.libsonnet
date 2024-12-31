local app = 'cloud-provider-aws';

{
  // The AWS Cloud Controller Manager is the controller that is primarily responsible for creating
  // and updating AWS loadbalancers (classic and NLB) and node lifecycle management.
  awsCloudControllerManager: {},

  // The AWS EBS CSI driver provides a CSI interface used by Container Orchestrators to manage the
  // lifecycle of Amazon EBS volumes.
  awsEBSCSIDriver: {},
}
