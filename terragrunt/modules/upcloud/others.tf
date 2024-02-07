variable "args" {
	type = object({

		upcloud = object({
			username = string
			password = string
		})
	})
}

locals {
  project = "instagram-clone"
  zone = "de-fra1"
}