package policies.vpc.vpc

# CIDRS invalidos
invalid_cidrs = [
  "0.0.0.0/0",
]

array_contains(arr, elem) {
  arr[_] = elem
}



# Checks security groups embdedded ingress rules
deny[reason] {
  changeset := input.resource_changes[_]
  changeset.type == "ibm_is_security_group_rule"
  cidr := changeset.change.after.remote
  direction := changeset.change.after.direction
  invalid := invalid_cidrs
  array_contains(invalid,cidr)
  reason := sprintf(
              "%-40s :: security group invalid %s CIDR %s",
              [changeset.address,direction,cidr]
            )
}

deny[reason] {
  changeset := input.resource_changes[_]
  changeset.type == "ibm_is_public_gateway"
  reason := sprintf(
              "%-40s :: public gateway not allowed for this application",
              [changeset.address]
            )
}