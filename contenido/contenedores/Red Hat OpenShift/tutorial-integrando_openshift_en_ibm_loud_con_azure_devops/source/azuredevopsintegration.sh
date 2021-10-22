
##https://mirror.openshift.com/pub/openshift-v4/clients/ocp/stable/

TOKEN=$1
SERVER=$2
PROJECT=$3

TOOL="azuredevops"
SERVICEACCOUNT="sa-"$TOOL
ROLEBINDING="rb-"$TOOL
ICONO="\xE2\x9C\x94 "

oc logout

RESULT=$(oc login --token=$TOKEN --server=$SERVER)

CLUSTERNAME=$(oc config view --minify -o jsonpath={.clusters[0].name})

echo -e $ICONO"Cluster name: "$CLUSTERNAME

RESULT=$(oc new-project $PROJECT)

echo -e $ICONO"Namespace: "$PROJECT

echo -e $ICONO"Server URL: "$SERVER

RESULT=$(oc create sa $SERVICEACCOUNT)

#echo -e $ICONO"Service Account: "$SERVICEACCOUNT

RESULT=$(oc create rolebinding $ROLEBINDING --clusterrole=edit --serviceaccount=$PROJECT:$SERVICEACCOUNT -n $PROJECT)

#echo -e $ICONO"Role Binding: "$ROLEBINDING

SECRET=$(oc get serviceAccounts $SERVICEACCOUNT -n $PROJECT -o=jsonpath={.secrets[0].name})

oc get secret $SECRET -n $PROJECT -o json > secret.json

echo -e $ICONO"Secret Exportado en: secret.json"

oc logout