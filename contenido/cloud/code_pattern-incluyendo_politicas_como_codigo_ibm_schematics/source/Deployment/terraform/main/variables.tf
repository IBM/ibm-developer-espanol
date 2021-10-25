variable "base_name" {}
variable "tags" {
  type        = list(string)
  description = "Tags that should be applied to the service"
  default     = null
}
variable "plan" {
description = "plan type (standard and lite)"
  type        = string
  default     = "lite"
}
variable "region" {}
variable "resource_group" {}