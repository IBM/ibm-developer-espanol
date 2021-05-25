# Guidelines

## Índice

- [Guidelines](#guidelines)
  - [Índice](#índice)
  - [Qué es un Code Pattern?](#qué-es-un-code-pattern)
  - [Templates](#templates)
    - [Estructura de Directorios](#estructura-de-directorios)
    - [Recursos de interés](#recursos-de-interés)
  - [Buenas prácticas](#buenas-prácticas)
  - [Código de Conducta](#código-de-conducta)

## Qué es un Code Pattern?

Un Code Pattern, o patrón de código, permite brindar una visión de 360° del código escrito para realizar un objetivo definido específico. Consta de dos partes principales:

1. Una descripción general en IBM Developer, incluyendo descripciones contextuales, diagramas de arquitectura, flujo de procesos, demostraciones, componentes de tecnología y publicaciones de blog relacionadas. Consulte la [sección sobre escritura de descripciones](https://w3.ibm.com/developer/docs/content/write-overview/) para obtener más información.
2. El código en sí, contenido que se hará disponible en este repositorio. Deberá incluir un README.md describiendo paso a paso la implementación correspondiente.

Los patrones de código son mucho más que la suma de sus partes: nos conectan con la comunidad de desarrollo y dicen "lo entendemos porque también somos desarrolladores; trabajemos juntos para conseguir el éxito".

Para más información, dirigirse a la [sección correspondiente en W3 Developer](https://w3.ibm.com/developer/docs/content/code-patterns/).

## Templates

El archivo `README.md` es la guía que permitirá al desarrollador instalar y configurar los aspectos necesarios para correr el Code Pattern, así como obtener información acerca de cómo replicar el contenido. Por motivos de consistencia, todo Code Pattern deberá seguir un formato. A continuación, proveemos una lista de templates:

- Template del [README para GitHub](TEMPLATE.md) (Español)
- Ejemplo de un README para una [aplicación de Watson](https://github.com/IBM/watson-banking-chatbot/blob/master/README.md) (Inglés)
- Ejemplo de un README para un [Jupyter Notebook](https://github.com/IBM/pixiedust-traffic-analysis/blob/master/README.md) (Inglés)
- Ejemplo de un README para un [pattern de Tensorflow](https://github.com/IBM/tensorflow-hangul-recognition/blob/master/README.md) (Inglés)
- Ejemplo de un README para un [Notebook de Apache Spark](https://github.com/IBM/elasticsearch-spark-recommender/blob/master/README.md) (Inglés)

Para más información, consultar la sección ["Develop a Pattern"](https://w3.ibm.com/developer/docs/content/develop-pattern/0) en IBM Developer. Además, puedes consultar Code Patterns ya publicados, tanto en [inglés](https://developer.ibm.com/patterns/) como en [Español](https://developer.ibm.com/es/patterns/).

### Estructura de Directorios

En caso de contar con archivos otros archivos además del `README.md`, se insta a utilizar la siguiente estructura de directorios:

- `directorio_raíz_del_code_pattern`
  - `assets`: archivos auxiliares al Code Pattern que no estén contemplados en las demás carpetas. Por ejemplo: un archivo .csv para utilizar como dataset en el entrenamiento de un modelo de Watson AutoAI.
  - `images`: imágenes a utilizar en todo el Code pattern
  - `scripts`: carpeta donde se encontrarán los scripts de código. La estructura interna dependerá del code pattern: puede ser un único script, o una estructura diferente.

El archivo `README.md` deberá colocarse en el directorio raíz del Code Pattern.

### Recursos de interés

- Markdown será el formato a utilizar para la creación de archivos README.md. Para más información sobre el mismo, recomendamos consultar este [cheat-sheet](https://www.markdownguide.org/cheat-sheet/)
- A fin de mantener un formato universal, instamos a utilizar este [template para diagramas de arquitectura](https://github.ibm.com/IBMCode/IBMCodeContent/blob/master/docs/patterns/templates/pattern-architecture-diagrams.pptx), de requerir elaborar alguno

## Buenas prácticas

Se recomienda que, cuando contribuyas a este repositorio, primero discutas el cambio a realizar con los propietarios de este repositorio, a través de los medios de comunicación que han establecido [aquí](../CONTRIBUITING.md).

A su vez, ten en cuenta que contamos con un [código de conducta](GUIDELINES.md#codigo-de-conducta) que habrá de seguirse en toda fase del proyecto.

## Código de Conducta

IBM Developer se compromete a hacer de este un entorno seguro, respetuoso y cómodo para todos los involucrados. Por tanto, nosotros, contribuyentes y mantenedores, nos comprometemos a asegurar que nuestra participación en la comunidad así como contribuciones de contenido contribuya a una experiencia libre de discriminación para todos, independientemente de su raza, color, religión, sexo, identidad o expresión de género, orientación sexual, nacionalidad, genética, discapacidad, edad o afiliaciones políticas.

IBM Developer se reserva el derecho de revisar este Código de conducta en cualquier momento. 

Para más información, consultar la [sección correspondiente en W3 Developer](https://w3.ibm.com/developer/docs/events/code-conduct/).