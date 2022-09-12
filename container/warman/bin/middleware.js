const appd_controller = require("./appd_controller.js");
const wl_apps = require("./apps");
const apps = require("../apps.json");
const util = require("./util");
const config = require("../config.json");
require("dotenv").config();

const wl_hostname = config.WL_HOSTNAME;

let tick_running = false;

module.exports = {
  /**
   * Açao principal a ser executada a cada intervalo definido
   * @returns void
   */
  tick: async (rootPath) => {
    async function loop(app) {
      let lastcheck_EUMWebEnabled = null;
      try {
        console.log("tick()");
        tick_running = true;
        const application_id = app.appId;
        const wl_appname = app.webLogicAppName;
        util.logger.info("ACESSANDO APP DYNAMICS CONTROLLER");
        const isEUMWebEnabled = await appd_controller.isEUMWebEnabled(
          application_id
        );
        console.info({ isEUMWebEnabled });

        if (isEUMWebEnabled === null || isEUMWebEnabled === undefined) {
          util.logger.error(
            `Não foi possível identificar se o script de navegador esta ativo no app de id ${application_id}. Verifique se esse aplicativo existe em "User Experience" do Controller AppDynamics.`
          );
          throw `Não foi possível identificar se o script de navegador esta ativo no app de id ${application_id}. Verifique se esse aplicativo existe em "User Experience" do Controller AppDynamics.`;
        }
        if (typeof isEUMWebEnabled !== "boolean") {
          util.logger.error(
            `Não foi possível identificar se o script de navegador esta ativo no app de id ${application_id}. Verifique se esse aplicativo existe em "User Experience" do Controller AppDynamics. isEUMWebEnabled=${isEUMWebEnabled}`
          );
          throw `Não foi possível identificar se o script de navegador esta ativo no app de id ${application_id}. Verifique se esse aplicativo existe em "User Experience" do Controller AppDynamics. isEUMWebEnabled=${isEUMWebEnabled}`;
        }

        if (
          isEUMWebEnabled === true &&
          (lastcheck_EUMWebEnabled === false ||
            lastcheck_EUMWebEnabled === null)
        ) {
          util.logger.info("BROWSER MONITORING ONLINE: BAIXANDO O SCRIPT");
          let codeSnippet = await appd_controller.getCodeSnippet(
            application_id
          );
          if (config.DEVELOPMENT === "true") {
            codeSnippet = config.DEVELOPMENT_SCRIPT;
          }
          try {
            await wl_apps.injectAppDScript(
              wl_hostname,
              wl_appname,
              codeSnippet,
              rootPath
            );
          } catch (err) {
            util.logger.error(err);
            console.log(err);
          }

          lastcheck_EUMWebEnabled = true;
        } else if (
          isEUMWebEnabled === false &&
          (lastcheck_EUMWebEnabled === true || lastcheck_EUMWebEnabled === null)
        ) {
          util.logger.info("BROWSER MONITORING OFFLINE: BAIXANDO O SCRIPT");

          let codeSnippet = await appd_controller.getCodeSnippet(
            application_id
          );
          if (config.DEVELOPMENT === "true") {
            codeSnippet = config.DEVELOPMENT_SCRIPT;
          }
          try {
            await wl_apps.removeAppDScript(
              wl_hostname,
              wl_appname,
              codeSnippet,
              rootPath
            );
          } catch (err) {
            util.logger.error(err);
            console.log(err);
          }
          lastcheck_EUMWebEnabled = false;
        }
        console.info("tick() concluído com sucesso.");
      } catch (ex) {
        console.error(ex);
      }
    }
    for (let app of apps) {
      util.logger.info(`EXECUTANDO: ${app.webLogicAppName}`);
      await loop(app);
      console.log({ app });
    }
    util.logger.info("ITERAÇÃO CONCLUIDA COM SUCESSO");
    tick_running = false;
  },
};
