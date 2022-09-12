const path = require("path");
const weblogic = require("./weblogic");
const config = require('../config.json')
const dev_applocation = "/tmp/app_01";
const util = require("./util");
const injector = require("./injector");
const { info } = require("console");

require("dotenv").config();

module.exports = {
  listFromServer: (hostname) => {
    return [
      {
        name: "app_01",
        location: dev_applocation,
      },
    ];
  },
  /**
   * Acrescenta conteúdo a um arquivo dentro de um pacote WAR publicado como aplicativo no WebLogic
   * @param {String} hostname Endereco do servidor do serviço WebLogic
   * @param {String} appname Nome do aplicativo no WebLogic
   * @param {String | undefined} filepath Caminho relativo do arquivo a ser alterado, em relação ao caminho fisico do aplicativo no WebLogic. Será considerado por padrão '/index.html' caso seja passado nulo.
   * @returns Caminho completo do arquivo que o conteúdo foi adicionado
   */
  injectAppDScript: (hostname, appname, codeSnippet, rootPath) => {
    console.info(`injectAppDScript(${hostname}, ${appname})`);
    util.logger.info(`INICIANDO INJEÇÃO DE SCRIPT ${hostname} - ${appname}`);
    // ?? '/index.html'
    return new Promise((resolve, reject) => {
      try {
        weblogic
          .getApplicationPath(appname)
          .then((appPath) => {
            // let _warPath = path.join(process.env.WL_BASEPATH, appPath);

            let _warPath = appPath;
            console.log({ _warPath });
            if (!_warPath.toLowerCase().endsWith(".war"))
              reject(
                "Caminho de deploy do aplicativo no  WebLogic não é um arquivo WAR"
              );

            util.logger.info(`INJETANDO SCRIPT NO HTML: ${_warPath}`);
            injector(
              rootPath,
              _warPath,
              appname,
              true,
              codeSnippet,
              (_ppath) => {
                // weblogic
                //   .redeploy(process.env.WL_APPNAME)
                //   .then(() => resolve(_warPath))
                //   .catch(reject);
              },
              reject,
              resolve
            );
          })
          .catch((ex0) => {
            console.error(ex0);
            util.logger.error(`ERRO NA INJEÇÃO DE SCRIPT: ${ex0.toString()}`);
            return reject(`Erro na insercao do conteudo: ${ex0.toString()}`);
          });
      } catch (ex00) {
        reject(ex00);
      }
    });
  },
  /**
   * Remove conteúdo de um arquivo dentro de um pacote WAR publicado como aplicativo no WebLogic
   * @param {String} hostname Endereco do servidor do serviço WebLogic
   * @param {String} appname Nome do aplicativo no WebLogic
   * @param {String | null} filepath Caminho relativo do arquivo a ser alterado, em relação ao caminho fisico do aplicativo no WebLogic. Será considerado por padrão '/index.html' caso seja passado nulo.
   * @returns Caminho completo do arquivo onde o conteudo foi removido.
   */
  removeAppDScript: (hostname, appname, codeSnippet, rootPath) => {
    util.logger.info(`INICIANDO REMOÇÃO DO SCRIPT: ${hostname} : ${appname}`);
    console.info(`removeAppDScript(${hostname}, ${appname}`);
    return new Promise((resolve, reject) => {
      try {
        weblogic
          .getApplicationPath(appname)
          .then((appPath) => {
            let _warPath = appPath;
            console.log(_warPath);
            if (!_warPath.toLowerCase().endsWith(".war"))
              reject(
                "Caminho de deploy do aplicativo no  WebLogic não é um arquivo WAR"
              );

            injector(
              rootPath,
              _warPath,
              appname,
              false,
              codeSnippet,
              (_ppath) => {
                util.logger.info("SCRIPT REMOVIDO COM SUCESSO");
                resolve();
                // weblogic
                //   .redeploy(process.env.WL_APPNAME)
                //   .then(() => resolve(_warPath))
                //   .catch(reject);
              },
              reject,
              resolve
            );
          })
          .catch((ex0) => {
            console.error(ex0);
            util.logger.error(`ERRO NA REMOÇÃO DO SCRIPT:  ${ex0.toString()}`);
            return reject(`Erro na remoção do conteudo: ${ex0.toString()}`);
          });
      } catch (ex00) {
        reject(ex00);
      }
    });
  },
};
