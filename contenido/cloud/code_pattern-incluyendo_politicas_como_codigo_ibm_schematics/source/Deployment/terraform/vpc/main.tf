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

data "ibm_is_ssh_key" "ssh_key" {
    name = "rego-test-key"
}


resource "ibm_is_vpc" "dev_vpc" {
    name = "${var.base_name}-development-vpc"
    tags = ["managedby:terraform","Environment:dev"]
}

resource "ibm_is_public_gateway" "public-gateway-1" {
    name = "${var.base_name}public-gateway-1"
    vpc = ibm_is_vpc.dev_vpc.id
    zone = "us-south-1"  
}

resource "ibm_is_public_gateway" "public-gateway-2" {
    name = "${var.base_name}public-gateway-2"
    vpc = ibm_is_vpc.dev_vpc.id
    zone = "us-south-2"
}

resource "ibm_is_vpc_address_prefix" "dev_vpc_address_prefix_1" {
    name = "${var.base_name}-prefix-1"
    zone = "us-south-1"
    vpc = ibm_is_vpc.dev_vpc.id
    cidr = "10.10.0.0/16"
}

resource "ibm_is_vpc_address_prefix" "dev_vpc_address_prefix_2" {
    name = "${var.base_name}-prefix-2"
    zone = "us-south-2"
    vpc = ibm_is_vpc.dev_vpc.id
    cidr = "10.20.0.0/16"
}

resource "ibm_is_subnet" "private_subnet_1" {
    name = "${var.base_name}-private-subnet-1"
    vpc = ibm_is_vpc.dev_vpc.id
    zone = "us-south-1"
    ipv4_cidr_block = "10.10.1.0/24"
    public_gateway = ibm_is_public_gateway.public-gateway-1.id
}

resource "ibm_is_subnet" "private_subnet_2" {
    name = "${var.base_name}-private-subnet-2"
    vpc = ibm_is_vpc.dev_vpc.id
    zone = "us-south-2"
    ipv4_cidr_block = "10.10.2.0/24"
    public_gateway = ibm_is_public_gateway.public-gateway-2.id
}

resource "ibm_is_security_group" "tutorial_sg" {
    name = "${var.base_name}-sg"
    vpc = ibm_is_vpc.dev_vpc.id
}

resource "ibm_is_security_group_rule" "inbound-http" {
    group = ibm_is_security_group.tutorial_sg.id
    direction = "inbound"
    remote = "0.0.0.0/0"
    tcp {
      port_min = 80
      port_max = 80
    }
}

resource "ibm_is_security_group_rule" "outbound-http" {
    group = ibm_is_security_group.tutorial_sg.id
    direction = "outbound"
    remote = "0.0.0.0/0"
    tcp {
      port_min = 80
      port_max = 80
    }
}

resource "ibm_is_security_group_rule" "outbound-https" {
    group = ibm_is_security_group.tutorial_sg.id
    direction = "outbound"
    remote = "0.0.0.0/0"
    tcp {
      port_min = 443
      port_max = 443
    }
}

resource "ibm_is_security_group_rule" "outbound-dns" {
    group = ibm_is_security_group.tutorial_sg.id
    direction = "outbound"
    remote = "0.0.0.0/0"
    tcp {
      port_min = 53
      port_max = 53
    }
}

resource "ibm_is_lb" "load-balancer" {
    name = "${var.base_name}-alb"
    subnets = [ibm_is_subnet.private_subnet_1.id,ibm_is_subnet.private_subnet_2.id]
}

resource "ibm_is_lb_pool" "load-balancer-pool" {
    name = "${var.base_name}-alb-pool"
    lb = ibm_is_lb.load-balancer.id
    protocol = "http"
    algorithm = "round_robin"
    health_delay = 15
    health_retries = 2
    health_timeout = 5
    health_type = "http"
    health_monitor_url = "/"
}

resource "ibm_is_lb_listener" "load-balancer-pool" {
    lb = ibm_is_lb.load-balancer.id
    protocol = "http"
    port = 80
    default_pool = ibm_is_lb_pool.load-balancer-pool.id
}

resource "ibm_is_instance_template" "instance-template" {
    name = "${var.base_name}-instance-ubuntu"
    image = "ibm-ubuntu-18-04-1-minimal-amd64-2"
    keys = [data.ibm_is_ssh_key.ssh_key.id]
    profile = "cx2-2x4"
    primary_network_interface {
      subnet = ibm_is_subnet.private_subnet_1.id
      security_groups = [ibm_is_security_group.tutorial_sg.id]
    }
    vpc = ibm_is_vpc.dev_vpc.id
    zone = "us-south-1"
    user_data = file("../script/userdata.sh")
}

resource "ibm_is_instance_group" "instance-group" {
    name = "${var.base_name}-instance-group"
    instance_template = ibm_is_instance_template.instance-template.id
    instance_count = 2
    subnets = [ibm_is_subnet.private_subnet_1.id,ibm_is_subnet.private_subnet_2.id]
    load_balancer = ibm_is_lb.load-balancer.id
    load_balancer_pool = ibm_is_lb_listener.load-balancer-pool.id
    application_port = 80
}

resource "ibm_is_instance_group_manager" "instance-group-manager" {
    name = "${var.base_name}-instance-group-manager"
    aggregation_window = 90
    cooldown = 120
    enable_manager = true
    instance_group = ibm_is_instance_group.instance-group.id
    min_membership_count = 2
    max_membership_count = 5
}

resource "ibm_is_instance_group_manager_policy" "igm-policy" {
    name = "${var.base_name}-cpu-policy"
    instance_group = ibm_is_instance_group.instance-group.id
    instance_group_manager = ibm_is_instance_group_manager.instance-group-manager.id
    metric_type = "cpu"
    metric_value = 80
    policy_type = "target"
}