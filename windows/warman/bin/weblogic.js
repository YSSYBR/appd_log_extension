require("dotenv").config();
const config = require("../config.json");
const username = config.WL_USERNAME;
const password = config.WL_PASSWORD;
const base_url = `${config.WL_PROTOCOL}://${config.WL_HOSTNAME}:${config.WL_PORT}/management/`;
const yrequest = require("./yrequest.js");
const req = yrequest.configure(base_url, username, password);

module.exports = {
  /**
   * Retorna o caminho fisico do serviço WebLogic em execução
   * @returns caminho fisico onde o servico WebLogic está instalado
   */
  getRootServicePath: async () => {
    try {
      const serverConfig = await req.get(
        `weblogic/${config.WL_VERSION}/serverConfig`
      );
      return (
        serverConfig?.rootDirectory || "** attribute rootDirectory not found **"
      );
    } catch (e) {
      console.error(
        `\x1b[31mERRO: Não foi possivel obter informacoes base do servidor WebLogic\x1b[0m`
      );
      console.error(e);
    }
  },

  /**
   * Retorna o caminho relativo do aplicativo publciado no WebLogic, em relação ao caminho fisico do servico WebLogic
   * @param {String} id Nome/Identificador da aplicação no WebLogic
   * @returns Caminho relativo do aplicativo
   */
  getApplicationPath: async (id) => {
    try {
      const appDetails = await req.get(
        `wls/latest/deployments/application/id/${id}`
      );
      return (
        appDetails?.item?.deploymentPath ||
        "** attrubyte deploymentPath not found **"
      );
    } catch (e) {
      console.error(
        `Não foi possivel obter informacoes do aplicativo de id ${id} no servidor WebLogic`
      );
      throw e;
    }
  },
  /**
   * Republica a aplicação no WebLogic
   * @param {String} id ID/Nome da aplicação
   */
  redeploy: async (id) => {
    try {
      let result = await req.post(
        `weblogic/${config.WL_VERSION}/edit/appDeployments/${id}/redeploy`
      );
      console.log(result);
    } catch (redeployEx) {
      console.log("Redeploy iniciado com sucesso.");
    }
  },
};
