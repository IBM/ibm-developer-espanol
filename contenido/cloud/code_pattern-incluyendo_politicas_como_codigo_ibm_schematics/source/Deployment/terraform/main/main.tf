terraform {
    required_providers {
        ibm = {
            source = "IBM-Cloud/ibm"
            version = "~> 1.31.0"
        }             
    }
}

provider "ibm" {
    region = "us-south"
}


module "cloudant" {
    source = "../cloudant"
    base_name = var.base_name
    tags = (var.tags != null ? var.tags : [])
    plan = var.plan                                                     
    region = var.region
    resource_group = var.resource_group
}

module "vpc" {
    source = "../vpc"
    base_name = var.base_name
}