package main

applicable_policies := [
    # "vpc",
    "cloudant"
]

initialize(policies) = router {
    router := { policy:value | value := data.policies[policies[_]][policy].deny}
}

router:=initialize(applicable_policies)

deny[msg] {
    policy := router[_]
    msg := policy[_]
}
