# ¡Agarrate Catalina! Enséñale términos personalizados a Watson Speech-To-Text

## Descripción

Watson Speech-To-Text, servicio que permite interpretar y transcribir audio, es de los mejor catalogados de la industria. Sin embargo, no conoce todas las palabras de un cierto idioma, puesto que fue entrenado para un uso general y no específico de una cierta área. Existen términos, expresiones y modismos que no es capaz de reconocer "out of the box". 

Es aquí donde los "modelos personalizados" entran a jugar. Con ellos, es posible incluir vocabulario que es específico de un cierto dominio o área de conocimiento, como puede ser el ámbito médico o legal, por citar dos ejemplos.

En este Code Pattern aprenderás a crear, entrenar y consultar un modelos personalizado de lenguaje en Watson Speech-To-Text.

## Objetivos de aprendizaje

Cuando hayas completado este Code Pattern, serás capaz de:

- Utilizar el servicio de Watson Speech-To-Text
- Crear y entrenar modelos de lenguaje personalizados
- Realizar consultas a la API de Watson Speech-To-Text desde una aplicación NodeJS para transcribir audio empleando modelos personalizados así como el modelo por defecto

## Requisitos previos

- Una cuenta de IBM Cloud. Si no la tientes [¡regístrate aquí!](https://cloud.ibm.com/registration)
- Una instancia Plus o Premium de [Watson Speech-To-Text](https://cloud.ibm.com/catalog/services/speech-to-text).
- Instalar el runtime de [NodeJS](https://nodejs.org/es/).
- Contar con un IDE o editor de código compatible con JavaScript. Para este Code Pattern se utilizó [Visual Studio Code](https://code.visualstudio.com/download).

No se requieren conocimientos previos específicos para realizarlo, aunque se recomienda poseer conocimientos básicos de JavaScript o programación.

## Tiempo estimado

Este tutorial debería llevarte unos 30 minutos, incluyendo el tiempo de entrenamiento en Watson Speech-To-Text.

## Índice

El code pattern se encuentra dividido en las siguientes secciones:

- [¡Agarrate Catalina! Enséñale términos personalizados a Watson Speech-To-Text](#agarrate-catalina-enséñale-términos-personalizados-a-watson-speech-to-text)
  - [Descripción](#descripción)
  - [Objetivos de aprendizaje](#objetivos-de-aprendizaje)
  - [Requisitos previos](#requisitos-previos)
  - [Tiempo estimado](#tiempo-estimado)
  - [Índice](#índice)
  - [Tutorial](#tutorial)
    - [Instalación de dependencias](#instalación-de-dependencias)
    - [Obtención de credenciales y creación de instancia](#obtención-de-credenciales-y-creación-de-instancia)
    - [Preparación de corpus y audios](#preparación-de-corpus-y-audios)
    - [Creación del modelo personalizado](#creación-del-modelo-personalizado)
    - [Carga del corpus](#carga-del-corpus)
    - [Entrenamiento del modelo](#entrenamiento-del-modelo)
    - [Consulta del modelo](#consulta-del-modelo)
  - [Resumen](#resumen)

## Tutorial

### Instalación de dependencias

El primer paso será asegurar que puedes ejecutar el código que aquí se indicará, por lo que deberás instalar las dependencias correspondientes. 

Para ello, debes abrir un terminal de comandos, dirigirte al directorio donde se encuentran los scripts de código mediante el comando `cd` y escribir:

```
npm install
```

En caso de que debas instalar todas las librerías manualmente, los comandos correspondientes son:

```
npm install ibm-watson@^6.0.3
npm install fluent-ffmpeg 
npm install diff
npm install colors
```

Debería crearse una carpeta "node_modules" conteniendo todas las dependencias necesarias para la correcta ejecución del programa.

### Obtención de credenciales y creación de instancia

Antes de ponerte manos a la obra, debes obtener las credenciales de tu instancia de Watson Speech-To-Text. Con ellas podrás conectarte con el servicio. 

Dirígete a tu instancia de Watson Speech-To-Text y en la sección de "Service Credentials" haz click en el botón de copia:

[Obtención de credenciales](./images/ObtencionCredenciales.PNG)

Luego habrás de cambiar en tu código la definición de la constante `service_credentials` para que tome el valor de credenciales que acabas de copiar. Debería de lucir así:

```javascript
// Importación de librerías
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const fs = require('fs');

// Definición de credenciales de servicio
const service_credentials =
{
    "apikey": "tu_api_key",
    "iam_apikey_description": "Auto-generated for key tu_api_key",
    "iam_apikey_name": "Auto-generated service credentials",
    "iam_role_crn": "valor_rol_crn",
    "iam_serviceid_crn": "valor_id_servicio_crn",
    "url": "url_de_tu_servicio"
}

// Definición de instancia de Watson STT
const speechToText = new SpeechToTextV1({
    authenticator: new IamAuthenticator({
        apikey: service_credentials.apikey,
    }),
    serviceUrl: service_credentials.url
});
```

Para más información se recomienda consultar la [documentación oficial de la API del servicio](https://cloud.ibm.com/apidocs/speech-to-text?code=node#introduction).

### Preparación de corpus y audios

Un corpus es un archivo de texto plano que contiene enunciados involucrando las palabras específicas que deseamos enseñarle a nuestro modelo. El servicio construirá un vocabulario extrayendo los términos que no existen en su vocabulario base. Es posible, e incluso recomendable, añadir más de un archivo al modelo personalizado.

Para este Code Pattern utilizaremos [el siguiente corpus](./corpus/corpus)), y un [archivo de audio](./audios/audiodeprueba.mp3), elaborados exclusivamente para este tutorial. El audio es una lectura de un fragmento del cuento "Nuestro primer cigarro", del autor uruguayo Horacio Quiroga.

Habrás de descargar ambos, si es que no lo has hecho, y colocarlos en los siguientes directorios:

- **Corpus:** `./corpus/`
- **Audio:** `./audios/`

Donde `./` representa el directorio donde se encuentra el script de código.

### Creación del modelo personalizado

Habiendo preparado los elementos con los que vas a trabajar, deberás crear el modelo mediante la API de Watson Speech-To-Text.

Tanto los métodos que se encuentran a disposición como sus parámetros y el formato de sus respuestas pueden encontrarse en la [documentación oficial de la API](https://cloud.ibm.com/apidocs/speech-to-text). 

Allí encontrarás también snippets de código en varios lenguajes, entre ellos Node (JavaScript), que puedes utilizar para desarrollar tu solución.

Para crear el modelo harás uso de la función `createLanguageModel(params)`, con los siguientes parámetros:

```javascript
const params = {
    name: 'MiBelloModelito_IBMDeveloper',
    baseModelName: 'es-AR_NarrowbandModel',
    description: 'Modelo de ejemplo para IBM Developer',
};
```

Esta función llamará al servicio y creará el modelo personalizado a partir de los parámetros definidos en la constante `params`.

```javascript
async function createLanguageModel(params) {
    // Se invoca al método de creación de modelo con nuestros parámetros
    return speechToText.createLanguageModel(params)
        .then(languageModel => {
            // Se imprime en consola la respuesta del servicio
            return JSON.stringify(languageModel, null, 2);
        })
        .catch(err => {
            return err;
        });
}

// Llamado a la función e impresión del resultado
const result = await createLanguageModel(params);
console.log(result);
```

El servicio retornará el identificador del modelo, con el siguiente formato:

```json
{
  "customization_id": "74f4807e-b5ff-4866-824e-6bba1a84fe96"
}
```

### Carga del corpus

Ahora que el modelo ha sido creado, el siguiente paso es agregar el corpus que permitirá entrenarlo. Utilizarás la función `addCorpus(params)`, que agregará el archivo al modelo personalizado.

```javascript
// Definición de parámetros
const corpusFilePath = "./corpus/corpus";
const corpusName = "corpus_IBMDeveloper";

// Definición de parámetros de agregado de corpus
const params = {
    customizationId: customModelID,
    corpusFile: fs.createReadStream(corpusFilePath),
    corpusName: corpusName,
};

async function addCorpus(params) {
    // Se invoca al método de agregado de corpus
    return speechToText.addCorpus(addCorpusParams)
        .then(result => {
            // Poll for corpus status.
            return result;
        })
        .catch(err => {
            return err;
        });
}

// Llamado a la función e impresión del resultado
const result = await addCorpus(params);
console.log(result);
```

Una vez finalizada la operación el servicio devolverá una respuesta vacía `{}`.

Para verificar el estado del corpus se utiliza la función `getCorpus` que, a partir del identificador del modelo y el nombre del corpus, retorna una respuesta con este formato:

```json
{
    "out_of_vocabulary_words": 21,
    "total_words": 417,
    "name": "corpus_IBMDeveloper",
    "status": "analyzed"
}
```

Indicando así su nombre, la cantidad de palabras nuevas que estamos agregando al modelo, la cantidad total de palabras, y el estado actual del corpus. Para más información, consultar la [documentación oficial](https://cloud.ibm.com/apidocs/speech-to-text?code=node#getcorpus).

### Entrenamiento del modelo

Ha llegado el momento más interesante: el del entrenamiento. Usarás la función `trainLanguageModel(params)`, que iniciará el entrenamiento con el corpus que agregaste al modelo. El único parámetro que se deberá enviar será el identificador del modelo.

```javascript
// Definición de parámetro de modelo personalizado
const params = {
    customizationId: "{customization_id}",
};

async function trainLanguageModel(params) {
    // Se invoca al método de entrenamiento
    return speechToText.trainLanguageModel(params)
        .then(result => {
            // Poll for language model status.
            return result;
        })
        .catch(err => {
            return err;
        });
}

// Llamado a la función e impresión del resultado
const result = await trainLanguageModel(params);
console.log(result);
```

El entrenamiento puede demorar algunos minutos en completarse. Es posible visualizar su estado utilizando la función `getLanguageModel(params)`. 

Una vez más, la respuesta que recibirás al finalizar será una vacía `{}`.

### Consulta del modelo

Finalmente, la hora de la verdad: la de consulta del modelo.

Con el fin de comprobar cuánto a aprendido Watson, utilizarás el mismo [archivo de audio cuya transcripción utilizaste para entrenar](./audios/audiodeprueba.mp3), y realizarás dos consultas:

1. Una con el modelo personalizado que acabas de crear
2. Otra con el modelo estándar que ofrece el servicio

Luego, compararás ambas transcripciones.

Para este propósito, se utiliza la función de reconocimiento que provee la API, `recognize(params)`.

```javascript
// Consulta del modelo personalizado
const params = {
    audio: fs.createReadStream(audioFilePath.concat("audiodeprueba.mp3")),  // Audio a transcribir
    objectMode: true,                                                       // Envía mensaje en formato JSON (true)
    contentType: 'audio/mp3',                                               // Formato de audio (flac, mp3, mpeg, mulaw, ogg, wav, webm)
    model: "es-AR_NarrowbandModel",                                         // Modelo de Audio
    languageCustomizationId: customModelID                                  // Identificador del modelo personalizado
};

async function recognizeText(params) {
    return speechToText.recognize(params)
        .then(result => {
            return result;
        })
        .catch(err => {
            return err;
        });
}

var result = await recognizeText(paramAnalyzeAudioCustomModel);
console.log(result);
```

Para más información respecto de la función, los parámetros que recibe, y formas alternativas de realizar el reconocimiento de audio, se recomienda ver la [documentación oficial](https://cloud.ibm.com/apidocs/speech-to-text?code=node#recognize).

Habiendo obtenido la respuesta del servicio, obtendrás la transcripción en formato texto para poder visualizarla más cómodamente. Para ello se provee la siguiente función:

```javascript
function getTranscriptTextOnly(serviceResponse) {
    var fullTranscript = [];
    var evResults = serviceResponse.results;

    for (var i in evResults) {
        var evAlternatives = evResults[i].alternatives;
        fullTranscript.push(evAlternatives[0].transcript);
    }

    return fullTranscript;
}

var customModelTranscript = getTranscriptTextOnly(serviceResponse);
console.log(customModelTranscript);
```

Ahora es el turno del otro modelo, el estándar. Repetiremos el proceso pero para los siguientes parámetros:

```javascript
// Consulta del modelo estándar
const params = {
    audio: fs.createReadStream(audioFilePath.concat("audiodeprueba.mp3")),  // Audio a transcribir
    objectMode: true,                                                       // Envía mensaje en formato JSON (true)
    contentType: 'audio/mp3',                                               // Formato de audio (flac, mp3, mpeg, mulaw, ogg, wav, webm)
    model: "es-AR_NarrowbandModel",                                         // Modelo de Audio
};
```

Finalmente, compararás ambas transcripciones utilizando dos librerías: en primer lugar, [diff](https://www.npmjs.com/package/diff), que buscará diferencias entre ambos textos. En segundo, [colors](https://www.npmjs.com/package/colors), que imprimirá en consola y resaltará similitudes y diferencias mediante un patrón de colores, a saber:

- **Verde:** caracteres nuevos.
- **Rojo:** caracteres eliminados.
- **Blanco:** caracteres en común.

La función provista para esto se llama `printTranscriptComparison` y se define de la siguiente forma:

```javascript
function printTranscriptComparison(defaultTranscript, customTranscript) {
    // Importación de librerías
    const colors = require('colors');
    const Diff = require('diff');

    const diff = Diff.diffChars(defaultTranscript, customTranscript);

    diff.forEach((part) => {
        // Verde: adiciones; Rojo: eliminaciones
        // Blanco: palabras/letras comunes
        const color = part.added ? 'green' :
            part.removed ? 'red' : 'white';
        process.stderr.write(part.value[color]);
    });

    // Impresión en consola de las transcripciones
    console.log();
}
```

Al final de la ejecución del [script completo](./codePattern.js), deberías obtener una respuesta como esta:

[Comparación de Transcripciones](./images/ComparacionModelos.PNG)

Aquí es posible ver varios cambios, entre ellos:

- La palabra, que el modelo estándar transcribió como "nada" es ahora "mamá". Ésta era la palabra correcta.
- El modelo personalizado detectó la palabra "que", omitida por el modelo estándar. Esto es también correcto, y una mejora respecto al modelo estándar.
- La palabra "china" es ahora "llenando". Una vez más, esto es correcto.

Para verificar la precisión de estas transcripciones respecto al audio original es recomendable consultar la [transcripción del audio de prueba](./transcriptions/audiodepruebaTranscript).

## Resumen

En este Code Pattern has conseguido:

- Crear un modelo de lenguaje personalizado en el servicio Watson Speech-To-Text
- Utilizar un corpus de 836 palabras para entrenar un modelo de Español Argentino
- Transcribir un archivo de audio de 2:40 minutos empleando tanto el modelo personalizado como el estándar
- Realizar una comparación de los resultados obtenidos