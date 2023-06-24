resource "null_resource" "local_k3d_cluster" {

  provisioner "local-exec" {
    when = create
    on_failure = fail

    command = "k3d cluster create --config ${path.module}/k3d.config.yaml"
  }

  provisioner "local-exec" {
    when = destroy
    on_failure = fail

    command = "k3d cluster delete instagram-clone-dev"
  }

}