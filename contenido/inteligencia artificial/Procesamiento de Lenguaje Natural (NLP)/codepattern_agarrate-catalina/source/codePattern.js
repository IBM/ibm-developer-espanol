////////////////////////////////////////////////////////////////////////////////////////////////
///                     Obtención de credenciales y creación de instancia                    ///
////////////////////////////////////////////////////////////////////////////////////////////////

// Importación de librerías
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const fs = require('fs');

// Definición de parámetros
const corpusFilePath = "./corpus/corpus";
const corpusName = "corpus_IBMDeveloper";
const audioFilePath = "./audios/";
const transcriptionsPath = "./transcriptions/"

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

const speechToText = new SpeechToTextV1({
    authenticator: new IamAuthenticator({
        apikey: service_credentials.apikey,
    }),
    serviceUrl: service_credentials.url
});

////////////////////////////////////////////////////////////////////////////////////////////////
///                            Creación del modelo personalizado                             ///
////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Creación de modelo de lenguaje personalizado
 * @param {*} params parámetros
 * @returns respuesta de la API
 */
async function createLanguageModel(params) {
    // Se invoca al método de creación de modelo con nuestros parámetros
    return await speechToText.createLanguageModel(params)
        .then(result => {
            // Se imprime en consola la respuesta del servicio
            return result;
        })
        .catch(err => {
            return err;
        });
}

////////////////////////////////////////////////////////////////////////////////////////////////
///                                    Agregado de corpus                                    ///
////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Añadidura de corpus al modelo
 * @param {*} params parámetros
 * @returns respuesta de la API
 */
async function addCorpus(params) {
    // Se invoca al método de agregado de corpus
    return speechToText.addCorpus(params)
        .then(result => {
            // Poll for corpus status.
            return result;
        })
        .catch(err => {
            return err;
        });
}

/**
 * Obtención del corpus. Útil para verificar si finalizó el entrenamiento
 * @param {*} params parámetros
 * @returns respuesta de la API
 */
async function getCorpus(params) {
    return await speechToText.getCorpus(params)
        .then(result => {
            return result;
        })
        .catch(err => {
            return err;
        });
}

////////////////////////////////////////////////////////////////////////////////////////////////
///                                 Entrenamiento del modelo                                 ///
////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Entrenamiento del modelo
 * @param {*} params parámetros
 * @returns respuesta de la API
 */
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

/**
 * Obtención de información del modelo
 * @param {*} params parámetros
 * @returns respuesta de la API
 */
async function getLanguageModel(params) {
    return speechToText.getLanguageModel(params)
        .then(result => {
            return result;
        })
        .catch(err => {
            return err;
        });
}

////////////////////////////////////////////////////////////////////////////////////////////////
///                                    Consulta del modelo                                   ///
////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Obtiene la respuesta del servicio para el archivo audioFilePath con los parámetros de params
 * @param {*} params Parámetros del servicio (ver documentación API)
 * @returns respuesta de la API
 */
async function recognizeText(params) {
    return speechToText.recognize(params)
        .then(result => {
            return result;
        })
        .catch(err => {
            return err;
        });
}

/**
 * Obtiene una transcripción del audio en formato sólo texto.
 * @param {*} serviceResponse respuesta de la API a la llamada de recognizeText
 */
function getTranscriptTextOnly(serviceResponse) {
    var fullTranscript = [];
    var evResults = serviceResponse.result.results;

    for (var i in evResults) {
        var evAlternatives = evResults[i].alternatives;

        fullTranscript.push(evAlternatives[0].transcript);
    }

    return fullTranscript.join("");
}

/**
 * Compara las transcripciones imprimiendo en consola un único texto utilizando los siguientes códigos de colores:
 * Verde: palabras o letras adicionales
 * Rojo: palabras o letras que fueron eliminadas
 * Gris: porciones de texto en común
 * @param {*} defaultTranscript transcripción empleando el modelo estándar
 * @param {*} customTranscript transcripción empleando el modelo personalizado
 */
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

////////////////////////////////////////////////////////////////////////////////////////////////
///                                   Ejecución del código                                   ///
////////////////////////////////////////////////////////////////////////////////////////////////

async function main() {
    // -------------------------------------------------------------------------
    // -------------------------- Creación del modelo --------------------------
    // -------------------------------------------------------------------------

    var watsonResponse;

    // Definición de parámetros de creación de modelo
    const createLanguageModelParams = {
        name: 'MiBelloModelito_IBMDeveloper',
        baseModelName: 'es-AR_NarrowbandModel',
        description: 'Modelo de ejemplo para IBM Developer',
    };

    // Creación del modelo
    watsonResponse = await createLanguageModel(createLanguageModelParams);
    console.log(JSON.stringify(watsonResponse, null, 2));

    // Obtención de identificador del modelo
    // const customModelID = watsonResponse.result.customization_id;
    console.log("ID del modelo:", customModelID);

    // -------------------------------------------------------------------------
    // --------------------------- Agregado de corpus --------------------------
    // -------------------------------------------------------------------------

    // Definición de parámetros de agregado de corpus
    const addCorpusParams = {
        customizationId: customModelID,
        corpusFile: fs.createReadStream(corpusFilePath),
        corpusName: corpusName,
    };

    // Agregado de Corpus
    watsonResponse = await addCorpus(addCorpusParams);
    console.log(JSON.stringify(watsonResponse, null, 2));

    /*  
    // Remover comentarios en caso de desear obtener información del corpus
    const getCorpusParams = {
        customizationId: customModelID,
        corpusName: corpusName,
    };

    watsonResponse = await getCorpus(getCorpusParams);
    console.log(JSON.stringify(watsonResponse, null, 2));
    */

    // -------------------------------------------------------------------------
    // ------------------------ Entrenamiento del modelo -----------------------
    // -------------------------------------------------------------------------

    // Definición de parámetro de modelo personalizado
    const paramCustomModelID = {
        customizationId: customModelID,
    };

    // Entrenamiento del modelo
    watsonResponse = await trainLanguageModel(paramCustomModelID);
    console.log(JSON.stringify(watsonResponse, null, 2));

    // /*
    // Remover comentarios en caso de desear obtener información del modelo
    // watsonResponse = await getLanguageModel(paramCustomModelID);
    // console.log(JSON.stringify(watsonResponse, null, 2));
    // */

    // -------------------------------------------------------------------------
    // -------------------------- Consulta del modelo --------------------------
    // -------------------------------------------------------------------------

    // Consulta del modelo personalizado
    const paramAnalyzeAudioCustomModel = {
        audio: fs.createReadStream(audioFilePath.concat("audiodeprueba.mp3")),  // Audio a transcribir
        objectMode: true,                                                       // Envía mensaje en formato JSON (true)
        contentType: 'audio/mp3',                                               // Formato de audio (flac, mp3, mpeg, mulaw, ogg, wav, webm)
        model: "es-AR_NarrowbandModel",                                         // Modelo de Audio
        languageCustomizationId: customModelID                                  // Identificador del modelo personalizado
    };

    // Reconocimiento de audio utilizando el modelo personalizado
    watsonResponse = await recognizeText(paramAnalyzeAudioCustomModel);
    console.log(JSON.stringify(watsonResponse, null, 2));

    // Obtención de transcripción en formato texto
    var customTextOnly = getTranscriptTextOnly(watsonResponse);
    console.log(customTextOnly);

    // Almacenamiento de transcripción en un archivo (opcional)
    fs.writeFileSync(transcriptionsPath.concat("customTextTranscript"), customTextOnly);

    // Consulta del modelo estándar
    const paramAnalyzeAudioDefaultModel = {
        audio: fs.createReadStream(audioFilePath.concat("audiodeprueba.mp3")),  // Audio a transcribir
        objectMode: true,                                                       // Envía mensaje en formato JSON (true)
        contentType: 'audio/mp3',                                               // Formato de audio (flac, mp3, mpeg, mulaw, ogg, wav, webm)
        model: "es-AR_NarrowbandModel",                                         // Modelo de Audio
    };

    // Reconocimiento de audio utilizando el modelo estándar
    watsonResponse = await recognizeText(paramAnalyzeAudioDefaultModel);
    console.log(JSON.stringify(watsonResponse, null, 2));

    // Obtención de transcripción en formato texto
    var defaultTextOnly = getTranscriptTextOnly(watsonResponse);

    // Almacenamiento de transcripción en un archivo (opcional)
    fs.writeFileSync(transcriptionsPath.concat("defaultTextTranscript"), defaultTextOnly);

    // Verificación de diferencias entre transcripciones
    // Si se poseen las transcripciones posible utilizar el archivo sin llamar al servicio
    // var customTextOnly = fs.readFileSync("./transcriptions/customTextTranscript").toString();
    // var defaultTextOnly = fs.readFileSync("./transcriptions/defaultTextTranscript").toString();

    printTranscriptComparison(defaultTextOnly, customTextOnly);
}

// Llamada a la función main que ejecutará todo el código
main();