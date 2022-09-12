exports.logger = {
  log: function (message) {
    global.logger.log(
      `${"\033[32m"}[${new Date().toLocaleString("pt-BR")}] LOG: ${
        typeof message === "object" ? JSON.stringify(message) : message
      } ${"\033[0m"}`
    );
  },
  error: function (message) {
    global.logger.error(
      `${"\033[31m"}[${new Date().toLocaleString(
        "pt-BR"
      )}] ERROR: ${message} ${"\033[0m"}`
    );
    if (
      process.env.NODE_ENV === "development" &&
      message.toString().includes("Error:")
    )
      console.trace();
  },
  warn: function (message) {
    global.logger.warn(
      `${"\033[33m"}[${new Date().toLocaleString("pt-BR")}] WARN: ${
        typeof message === "object" ? JSON.stringify(message) : message
      } ${"\033[0m"}`
    );
  },
  info: function (message) {
    global.logger.info(
      `${"\033[34m"}[${new Date().toLocaleString("pt-BR")}] INFO: ${
        typeof message === "object" ? JSON.stringify(message) : message
      } ${"\033[0m"}`
    );
  },
  debug: function (message) {
    if (config.NODE_ENV === "development")
      global.logger.debug(
        `${"\033[35m"}[${new Date().toLocaleString("pt-BR")}] DEBUG: ${
          typeof message === "object" ? JSON.stringify(message) : message
        } ${"\033[0m"}`
      );
  },
  action: function (message) {
    global.logger.info(
      `${"\033[36m"}[${new Date().toLocaleString("pt-BR")}] ACTION: ${
        typeof message === "object" ? JSON.stringify(message) : message
      }${"\033[0m"}`
    );
  },
};
