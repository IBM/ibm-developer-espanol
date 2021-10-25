package policies.cloudant.cloudant

import data.policies.utils.tags_validation

masterKeys(changeset,root_resources,resource_type) = number {
	allkeys := { key | key := root_resources[i].address; is_master_key(root_resources[i],resource_type)}
    writers := { key | key := substring(changeset[i].address,count(changeset[i].module_address)+1, count(changeset[i].address)-count(changeset[i].module_address)+1); is_resource_key_writer(changeset[i]) }
    number := count(allkeys & writers)
}

contains(array, elem) {
  array[_] = elem
}

is_resource_instance(resource) {
	resource.type == "ibm_resource_instance"
}

is_resource_key(resource) {
	resource.type == "ibm_resource_key"
}

is_resource_key_writer(resource) {
	is_resource_key(resource)
    resource.change.after.role == "Writer"
}

is_master_key(root_module_resource,referenced_resource) {
    is_resource_key(root_module_resource)
    references:= root_module_resource.expressions.resource_instance_id.references
    contains(references,referenced_resource)
}


#Check resources have a resource group
deny[reason] {
    changeset := input.resource_changes[_]
    is_resource_instance(changeset)
    not changeset.change.after.resource_group_id
    reason := sprintf(
              "%-40s :: El recurso no cuenta con resource group definido",[changeset.address]
            )
}

#Check resource have the required tags
deny[reason] {
    changeset := input.resource_changes[_]
    tags:= changeset.change.after.tags
    newTags:= tags_validation.format(tags)
    is_resource_instance(changeset)
    not tags_validation.tags_contain_proper_keys(newTags)
    reason:= sprintf("%-40s :: El recurso no cuenta con los tags minimos requeridos o el formato es incorrecto, los tags requeridos son %s",[changeset.address,tags_validation.minimum_tags])
}

#Check resource have the required tag format
deny[reason] {
    changeset := input.resource_changes[_]
    is_resource_instance(changeset)
    tags:= changeset.change.after.tags
    not tags_validation.format_match(tags)
    reason:= sprintf("%-40s :: Los tags del recurso no cumplen con el formato requerido k:v",[changeset.address])
}

#Check if cloudant has only one writer key during creation
deny[reason] {
	changeset := input.resource_changes[_]
    is_resource_instance(changeset)
    changeset.change.after.service == "cloudantnosqldb"
    address := changeset.address
    module_address:= changeset.module_address
    newAddress:= substring(address, count(module_address)+1, count(address)-count(module_address)+1)
    keys:= masterKeys(input.resource_changes,input.configuration.root_module.module_calls[_].module.resources,newAddress)
    keys != 1
    reason:= sprintf("%-40s :: Cloudant debe tener solo una llave de escritura",[changeset.address])
}