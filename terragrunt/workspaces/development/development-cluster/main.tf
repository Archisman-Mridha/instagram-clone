resource "null_resource" "this" {

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