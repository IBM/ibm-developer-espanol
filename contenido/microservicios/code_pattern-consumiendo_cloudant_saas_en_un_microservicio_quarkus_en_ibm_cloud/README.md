# Consumiendo Cloudant SaaS en un microservicio Quarkus en IBM Cloud

## Descripción

Quarkus es un framework Java nativo de la nube, lo que significa que la principal plataforma de implementación es por contenedores. Por otro lado, Cloudant, es una base de datos distribuida y totalmente gestionada, optimizada tanto para cargas de trabajo pesadas como aplicaciones web y móviles de rápido crecimiento. En este Code Pattern aprenderás a desarrollar un microservicio basado en el framework Quarkus 2.2 integrado al servicio de IBM Cloud, Cloudant, el cual permitirá listar, actualizar, registrar y eliminar documentos en una base de datos.

## Objetivos de aprendizaje

Cuando hayas completado este Code Pattern, serás capaz de:

- Utilizar el servicio Cloudant
- Desarrollar un microservicio Quarkus 2.2 integrado a IBM Cloudant utilizando la libreria oficial [IBM Cloudant Java SDK Version 0.0.27](https://github.com/IBM/cloudant-java-sdk) que contemple listar, actualizar, registrar y eliminar documentos en una base de datos

## Requisitos previos

- Una cuenta de IBM Cloud. Si no la tienes [¡regístrate aquí!](https://cloud.ibm.com/registration)
- Acceso a una instancia Lite de [IBM Cloudant](https://cloud.ibm.com/catalog/services/cloudant).

Para el microservicio Quarkus necesitarás:
- Instalar [JDK 11+](https://adoptopenjdk.net/).
- Instalar [Apache Maven 3.8.1+](https://maven.apache.org/download.cgi).
- Contar con un IDE o editor de código compatible con Java. Para este Code Pattern se utilizó [Visual Studio Code](https://code.visualstudio.com/).

No se requieren conocimientos previos específicos para realizarlo, aunque se recomienda poseer conocimientos básicos de Java o programación.

## Tiempo estimado

Este tutorial debería llevarte unos 30 minutos como máximo.

## Índice

El code pattern se encuentra dividido en las siguientes secciones:

- [Consumiendo Cloudant SaaS en un microservicio Quarkus en IBM Cloud](#consumiendo-cloudant-saas-en-un-microservicio-quarkus-en-ibm-cloud)
  - [Descripción](#descripción)
  - [Objetivos de aprendizaje](#objetivos-de-aprendizaje)
  - [Requisitos previos](#requisitos-previos)
  - [Tiempo estimado](#tiempo-estimado)
  - [Índice](#índice)
  - [Tutorial](#tutorial)
    - [Step 1: Crear base de datos en IBM Cloudant](#step-1:-crear-base-de-datos-en-IBM-Cloudant)
    - [Step 2: Ejecutar el microservicio Quarkus](#step-2:-ejecutar-el-microservicio-quarkus)
  - [Resumen](#resumen)
  
## Tutorial
### Step 1: Crear base de datos en IBM Cloudant
1. Al tener una instancia de IBM Cloudant, crear una base de datos con el nombre: `books`.

<p align="center">
  <img src="docs/Crear base de datos en IBM Cloudant.png" width="50%">
</p>

2. Ahora, se deben generar las credenciales del servicio.

<p align="center">
  <img src="docs/Generacion de credenciales IBM Cloudant.png" width="80%">
</p>

### Step 2: Ejecutar el microservicio Quarkus
1. Luego de clonar el repositorio, en la ruta: `src/main/resources/application.properties`, ingresar las credenciales del servicio Cloudant obtenidas en el Step 1 (`apikey`, `url`):

```
cloudant.url={url}
cloudant.apikey={apikey}
```

2. Para ejecutar la aplicación en local `dev mode`, abrir la terminal e ingresar el comando:

```shell script
./mvnw compile quarkus:dev
```

El microservicio disponibilizará los siguientes endpoints:

Endpoint|Metodo|Detalle|Curl
----------|------|------|------
/book     | GET    | Lista de todos los libros   | curl -H "Content-Type: application/json" http://localhost:8080/book
/book/{id}| GET    | Obtener detalles de un libro| curl -H "Content-Type: application/json" http://localhost:8080/book/ID
/book     | POST   | Crear un libro              | curl -X POST -H "Content-Type: application/json" -d '{"name":"name", "author": "author"}' http://localhost:8080/book
/book/{id}| PUT    | Actualizar un libro         | curl -X PUT -H "Content-Type: application/json" -d '{"name":"name", "author": "author"}' http://localhost:8080/book/ID
/book/{id}| DELETE | Eliminar un libro           | curl -X DELETE http://localhost:8080/book/ID

Asimismo contiene los siguientes componentes:

- [RESTEasy JAX-RS](https://quarkus.io/guides/rest-json)
- [RESTEasy Jackson](https://quarkus.io/guides/rest-json)
- [IBM Cloudant Java SDK Version 0.0.27](https://github.com/IBM/cloudant-java-sdk)

## Resumen
En este Code Pattern has conseguido:

- Crear una base de datos en una instancia de IBM Cloudant
- Desarrollar un microservicio Quarkus
- Integrar un microservicio Quarkus con IBM Cloudant
