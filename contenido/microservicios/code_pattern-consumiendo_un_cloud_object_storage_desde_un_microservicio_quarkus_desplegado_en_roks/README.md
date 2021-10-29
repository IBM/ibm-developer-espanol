# Consumiendo un Cloud Object Storage desde un microservicio Quarkus desplegado en ROKS

## Descripción

Quarkus es un framework Java nativo de la nube, lo que significa que la principal plataforma de implementación es por contenedores. Por otro lado, Cloud Object Storage, es un servicio de almacenamiento ideal para datos no estructurados, además brinda opciones de transferencias de datos de dalta velocidad con IBM Aspera. En este Code Pattern aprenderás a desplegar en ROKS un microservicio basado en el framework Quarkus integrado al servicio de IBM Cloud, Cloud Object Storage, el cual permitirá listar, descargar, cargar y eliminar objetos de un bucket.

## Objetivos de aprendizaje

Cuando hayas completado este Code Pattern, serás capaz de:

- Utilizar el servicio Cloud Object Storage
- Desarrollar un microservicio Quarkus integrado a Cloud Object Storage que contemple listar, descargar, eliminar y cargar objetos a un bucket
- Desplegar un microservicio Quarkus en ROKS

## Requisitos previos

- Una cuenta de IBM Cloud. Si no la tienes [¡regístrate aquí!](https://cloud.ibm.com/registration)
- Acceso a una instancia Lite de [Cloud Object Storage](https://cloud.ibm.com/objectstorage/create).
- Acceso a un cluster [Red Hat OpenShift](https://cloud.ibm.com/kubernetes/catalog/create?platformType=openshift)

Para el microservicio Quarkus necesitarás:
- Instalar [JDK 11+](https://adoptopenjdk.net/).
- Instalar [Apache Maven 3.8.1+](https://maven.apache.org/download.cgi).
- Contar con un IDE o editor de código compatible con Java. Para este Code Pattern se utilizó [IntelliJ IDEA](https://www.jetbrains.com/idea/download/).

No se requieren conocimientos previos específicos para realizarlo, aunque se recomienda poseer conocimientos básicos de Java o programación.

## Tiempo estimado

Este tutorial debería llevarte unos 30 minutos como máximo.

## Índice

El code pattern se encuentra dividido en las siguientes secciones:

- [Consumiendo un Cloud Object Storage desde un microservicio Quarkus desplegado en ROKS](#consumiendo-un-cloud-object-storage-desde-un-microservicio-Quarkus-desplegado-en-ROKS)
  - [Descripción](#descripción)
  - [Objetivos de aprendizaje](#objetivos-de-aprendizaje)
  - [Requisitos previos](#requisitos-previos)
  - [Tiempo estimado](#tiempo-estimado)
  - [Índice](#índice)
  - [Tutorial](#tutorial)
    - [Step 1: Crear bucket y credenciales en COS](#step-1:-crear-bucket-y-credenciales-en-COS)
    - [Step 2: Ejecutar el microservicio Quarkus](#step-2:-ejecutar-el-microservicio-quarkus)
    - [Step 3: Desplegar el microservicio en ROKS](#step-3:-desplegar-el-microservicio-en-ROKS)
    - [Step 4: Testing a los endpoints](#step-4:-testing-a-los-endpoints)
  - [Resumen](#resumen)
  
## Tutorial
### Step 1: Crear bucket y credenciales en COS
1. Al tener una instancia de COS, crear un bucket de nombre: `cloud-object-storage-demo-cos` utilizando la opción de un "Depósito Predefinido".
<p align="center">
  <img src="images/Creacion de bucket COS.png" width="100%">
</p>

2. Ahora, se deben generar las credenciales del servicio, incluyendo en opciones avanzadas: `credenciales HMAC`.
<p align="center">
  <img src="images/Generacion de credenciales COS.png" width="80%">
</p>

### Step 2: Ejecutar el microservicio Quarkus
1. Ejecutar la aplicación en el entorno local `dev mode`, ingresando el comando:
```shell script
./mvnw compile quarkus:dev
```

Asegurarse de ingresar las credenciales del servicio COS obtenidas en el Step 1 (`access_key_id`, `secret_access_key`, `cos_bucket_name`), en la ruta `src/main/resources/application.properties` :
```
%prod.quarkus.s3.endpoint-override=https://s3.us-south.cloud-object-storage.appdomain.cloud
%dev.quarkus.s3.endpoint-override=https://s3.us-south.cloud-object-storage.appdomain.cloud

%prod.quarkus.s3.aws.credentials.static-provider.access-key-id={access_key_id}
%dev.quarkus.s3.aws.credentials.static-provider.access-key-id={access_key_id}

%prod.quarkus.s3.aws.credentials.static-provider.secret-access-key={secret_access_key}
%dev.quarkus.s3.aws.credentials.static-provider.secret-access-key={secret_access_key}

%prod.cos-bucket-name={cos_bucket_name}
%dev.cos-bucket-name={cos_bucket_name}
```
Tener en cuenta que para ejecutar en local, se deben agregar las credenciales en application.properties en los user %dev, %test y %prod.


2. El microservicio disponibilizará los siguientes endpoints:

Endpoint | Detalle
-----------|---------
http://localhost:8080/s3|Listar objetos del bucket
http://localhost:8080/s3/download/{objectKey}|Descargar objetos del bucket
http://localhost:8080/s3/upload/{objectKey}|Cargar objetos al bucket
http://localhost:8080/s3/delete/{objectKey}|Eliminar objetos al bucket

Asimismo contiene los siguientes componentes:

Componente | Enlaces de Referencia
---------------|-------------------
quarkus-amazon-s3|https://quarkus.io/guides/amazon-s3
url-connection-client|https://quarkus.io/guides/amazon-s3
quarkus-resteasy-jackson|https://quarkus.io/guides/rest-json
quarkus-resteasy|https://quarkus.io/guides/rest-json

También se pueden visualizar en la siguiente intarfaz: `http://localhost:8080/q/dev/`
<p align="center">
  <img src="images/Interfaz del detalle de los componentes.png" width="100%">
</p>

### Step 3: Desplegar el microservicio en ROKS
1. Acceder a la consola de ROKS, y para el login al clúster, seleccionar la opción `Copy Login Command`
<p align="center">
  <img src="images/Comando en ROKS para el Login.png" width="80%">
</p>

2. Copiar el valor de `Log in with this token` en la terminal para el login al clúster. Asimismo, se debe seleccionar el proyecto en el que se desplegará el microservicio.
```
oc login --token={token} --server={server}
oc project {name-project}
```

3. Ingresar al directorio del microservicio, y ejecutar el siguiente comando para el buid & deploy del microservicio.
```
./mvnw clean package -Dquarkus.kubernetes.deploy=true
```
Tener en cuenta que, al hacer el build con el comando anterior, se generará una carpeta  `target`, la cual contenerá el yml para el despliegue en ROKS en la siguiente ruta: `target/kubernetes/openshift.yml`. Por ello, en ROKS este comando generará el  `Deployment Config`, `Config Maps`,  `Services`, `Routes`, y la imagen en `Image Streams`.

4. En la consola de ROKS, ingresar a la vista `Developer`, y en Topology se visualizará el pod:
<p align="center">
  <img src="images/Microservicio Desplegado.png" width="70%">
</p>

Al seleccionar el pod, también se desplegará el detalle del mismo, el cual incluye la ruta generada del microservicio en la parte inferior.
<p align="center">
  <img src="images/Detalle de Microservicio Desplegado.png" width="70%">
</p>


### Step 4: Testing a los endpoints

1. Listar objetos del bucket
`{route}/s3/`
<p align="center">
  <img src="images/Postman Listar objetos.png" width="100%">
</p>

2. Descargar objetos del bucket
`{route}/s3/download/mario.jpeg`
<p align="center">
  <img src="images/Postman Descargar objetos.png" width="100%">
</p>

3. Cargar objetos al bucket
`{route}/s3/upload/pelicula.jpg`
<p align="center">
  <img src="images/Postman Cargar objetos.png" width="100%">
</p>

4. Eliminar objetos del bucket
`{route}/s3/delete/mario.jpeg`
<p align="center">
  <img src="images/Postman Eliminar objetos.png" width="100%">
</p>

  
## Resumen
En este Code Pattern has conseguido:

- Crear un bucket en una instancia de COS
- Desarrollar un microservicio Quarkus
- Integrar un microservicio Quarkus con COS
- Desplegar un microservicio Quarkus en ROKS
