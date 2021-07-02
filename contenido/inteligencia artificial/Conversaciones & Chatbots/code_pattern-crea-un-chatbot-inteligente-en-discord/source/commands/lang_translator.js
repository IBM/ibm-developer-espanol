module.exports = {
    name : 'Language Translator',
    desc : 'Translate text from input to output!',
    execute(msg, args)
    {
      const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
      const { IamAuthenticator } = require('ibm-watson/auth');
      
      const languageTranslator = new LanguageTranslatorV3({
        version: '2018-04-28',
        authenticator: new IamAuthenticator({
          apikey: process.env.APIKEY_TRANS,
        }),
        serviceUrl: process.env.SERVICE_URL_TRANS,
      });
      
      text_to_trans = args;

      const identifyParams = {
        text: text_to_trans
      };

      languageTranslator.identify(identifyParams)
        .then(identifiedLanguages => {
          const response = JSON.stringify(identifiedLanguages, null, 2);
          const answer_id = JSON.parse(response);
          const lang_id = answer_id.result.languages[0].language;
          const translateParams = {
            text: text_to_trans,
            modelId: `${lang_id}-en`,
          };
          
          languageTranslator.translate(translateParams)
            .then(translationResult => {
              const response = JSON.stringify(translationResult, null, 2);
              const answer_trans = JSON.parse(response);
              const result_trans = Array.from(answer_trans.result.translations);
              if (!result_trans.length) { return msg.reply(`No results found for **${args}**.`); }
              for (let sentence of result_trans) { msg.channel.send(sentence.translation); }
            })
            .catch(err => {
              console.log('error:', err);
            });
        })
        .catch(err => {
          console.log('error:', err);
      });
    }
}