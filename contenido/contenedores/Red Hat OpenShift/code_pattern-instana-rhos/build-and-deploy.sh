#!/bin/bash
# -d = dockerhub name

DOCKERHUB_NAME=""
while getopts d: option
	do
		case "${option}"
		in
			d) DOCKERHUB_NAME=${OPTARG};;
		esac
done

[ -z "$DOCKERHUB_NAME" ] && echo "Missing required -d flag for Dockerhub Username"  && exit 1

cd src
yarn
cd ..

docker build -t ${DOCKERHUB_NAME}/node-base:v1 src

sed "s/\${DOCKERHUB_NAME}/${DOCKERHUB_NAME}/" src/services/destination-v1/Dockerfile_template > src/services/destination-v1/Dockerfile
docker build -t ${DOCKERHUB_NAME}/destination-v1:latest src/services/destination-v1
rm -rf src/services/destination-v1/Dockerfile

sed "s/\${DOCKERHUB_NAME}/${DOCKERHUB_NAME}/" src/services/car-rental-v1/Dockerfile_template > src/services/car-rental-v1/Dockerfile
docker build -t ${DOCKERHUB_NAME}/carrental-v1:latest src/services/car-rental-v1
rm -rf src/services/car-rental-v1/Dockerfile

sed "s/\${DOCKERHUB_NAME}/${DOCKERHUB_NAME}/" src/services/currency-exchange/Dockerfile_template > src/services/currency-exchange/Dockerfile
docker build -t ${DOCKERHUB_NAME}/currencyexchange:latest src/services/currency-exchange
rm -rf src/services/currency-exchange/Dockerfile

docker build -t ${DOCKERHUB_NAME}/python-hotel-v1:latest src/services/hotel-v1-python

sed "s/\${DOCKERHUB_NAME}/${DOCKERHUB_NAME}/" src/services/ui/Dockerfile_template > src/services/ui/Dockerfile
docker build -t ${DOCKERHUB_NAME}/ui:latest src/services/ui
rm -rf src/services/ui/Dockerfile

docker login

docker push ${DOCKERHUB_NAME}/destination-v1:latest
docker push ${DOCKERHUB_NAME}/carrental-v1:latest
docker push ${DOCKERHUB_NAME}/currencyexchange:latest
docker push ${DOCKERHUB_NAME}/python-hotel-v1:latest
docker push ${DOCKERHUB_NAME}/ui:latest

oc apply -f config/oc-project.yaml
sleep 2s
oc project bee-travels

sed "s/\${DOCKERHUB_NAME}/${DOCKERHUB_NAME}/" config/destination-v1-deploy.yaml > config/destination-v1-deploy-temp.yaml
oc apply -f config/destination-v1-deploy-temp.yaml -f config/destination-v1-service.yaml
rm -rf config/destination-v1-deploy-temp.yaml

sed "s/\${DOCKERHUB_NAME}/${DOCKERHUB_NAME}/" config/carrental-v1-deploy.yaml > config/carrental-v1-deploy-temp.yaml
oc apply -f config/carrental-v1-deploy-temp.yaml -f config/carrental-v1-service.yaml
rm -rf config/carrental-v1-deploy-temp.yaml

sed "s/\${DOCKERHUB_NAME}/${DOCKERHUB_NAME}/" config/currencyexchange-deploy.yaml > config/currencyexchange-deploy-temp.yaml
oc apply -f config/currencyexchange-deploy-temp.yaml -f config/currencyexchange-service.yaml
rm -rf config/currencyexchange-deploy-temp.yaml

sed "s/\${DOCKERHUB_NAME}/${DOCKERHUB_NAME}/" config/hotel-v1-python-deploy.yaml > config/hotel-v1-python-deploy-temp.yaml
oc apply -f config/hotel-v1-python-deploy-temp.yaml -f config/hotel-v1-python-service.yaml
rm -rf config/hotel-v1-python-deploy-temp.yaml

sed "s/\${DOCKERHUB_NAME}/${DOCKERHUB_NAME}/" config/ui-deploy.yaml > config/ui-deploy-temp.yaml
oc apply -f config/ui-deploy-temp.yaml -f config/ui-service.yaml
rm -rf config/ui-deploy-temp.yaml

oc status
