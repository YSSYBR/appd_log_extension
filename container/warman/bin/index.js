require("dotenv").config();
const config = require("../config.json");
const appd_middleware = require("./middleware.js");
const weblogic = require("./weblogic");
const util = require("./util");
const fs = require("fs");
const { Console } = require("console");
const interval = config.INTERVAL;
console.log({ interval });

configureLog()
  .then(initializeService)
  .catch((err) => {
    console.log("ERRO");
    console.error(err);
  });

function initializeService(logger) {
  global.logger = logger;

  weblogic
    .getRootServicePath()
    .then((rootPath) => {
      console.info(`Caminho base do servico weblogic recebido:\n\t${rootPath}`);
      const pathURL = `../../../opt/app/c/${rootPath.split('\\').splice(1).join('/')}`


      util.logger.info("INICIANDO SERVIÇO");
      util.logger.info(`TEMPO DE INTERVALO DE EXECUÇÃO : ${config.INTERVAL}`);
      appd_middleware.tick(pathURL).then(() =>
        setInterval(() => {
          appd_middleware.tick(pathURL);
        }, config.INTERVAL)
      );
    })
    .catch((err) => {
      console.error("Erro ocorrido");
      console.error(err);
    });
}

function configureLog() {
  return new Promise((resolve, reject) => {
    try {
      if (config.NODE_ENV == "development") {
        resolve(console);
        return;
      }

      function createLogFile(path) {
        let todayDate = new Date()
          .toISOString()
          .replace("-", "")
          .replace("-", "")
          .replace(":", "")
          .replace(":", "")
          .replace("T", "")
          .substr(0, 14);

        const stdout_file = `${path}/${todayDate}.log`;
        var stdout_stream = fs.createWriteStream(stdout_file, { flags: "a" });

        const logger = new Console({
          stdout: stdout_stream,
        });
        resolve(logger);
      }
      const log_dir_path = "./logs";
      fs.access(log_dir_path, (err) => {
        if (err != null) {
          console.log(`Criando pasta: ${log_dir_path}`);
          fs.mkdir(log_dir_path, (err, path) => {
            if (err != null)
              reject({
                err: err,
                message: "Não foi possível criar pasta ./logs",
              });
            else createLogFile(path);
          });
        } else {
          console.info(`Pasta de log identificada: ${log_dir_path}`);
          createLogFile(log_dir_path);
        }
      });
    } catch (ex) {
      reject(ex);
    }
  });
}
