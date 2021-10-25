package policies.utils.tags_validation

minimum_tags = {
  "Entorno",
  "Owner",
  "Proyecto"
}

tags_contain_proper_keys(tags)  {
    keys := {key | tags[key]}
    leftover := minimum_tags - keys
    leftover == set()
}

format(tags) = new {
	new:= { k:v | 
    v:= split(tags[i],":")[1]
    k:= split(tags[i],":")[0]
	}	
}

is_match(value) {
	re_match(`^([A-Z][a-z0-9]+):([A-Z][a-z0-9]+)$`,value)
}

any_non_format(tags) {
	val := tags[_]
    not is_match(val)
}

format_match(tags) {
	not any_non_format(tags)
}