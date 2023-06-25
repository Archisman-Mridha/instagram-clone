resource "null_resource" "this" {
  provisioner "local-exec" {

    when = create
    on_failure = fail

    command = <<EOC
      vcluster create staging-vcluster \
        --extra-values=${path.module}/staging.vcluster.values.yaml

      vcluster disconnect
    EOC
  }
}