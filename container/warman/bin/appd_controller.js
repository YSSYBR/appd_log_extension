require("dotenv").config();
const config = require('../config.json')
const request = require("request");
const base_url = `${config.APPD_PROTOCOL}://${config.APPD_HOSTNAME}:${config.APPD_PORT}/controller/`;

const auth = () => {
  const url = `${base_url}api/oauth/access_token`;
  //const body = encodeURI(`grant_type=client_credentials&client_id=${config.APPD_CLIENTID}&client_secret=${config.APPD_CLIENTSECRET}`);
  const body =
    "grant_type=client_credentials&client_id=devyssy@yssysolucoes-nfr&client_secret=cd012825-0be9-4e3e-93b1-deb71110f38f";
  console.info({ url, body });
  return new Promise((resolve, reject) => {
    request.post(
      url,
      {
        body: body,
      },
      function (err, res, body) {
        console.info(`Done. - POST ${url}`);
        if (err) reject(err);
        console.info(`status code: ${res.statusCode}`);
        if (res.statusCode < 200 || res.statusCode > 299) {
          console.error("FALHA INTERNA NO SERVIDOR REMOTO");
          return reject(
            `status code: ${res.statusCode}, message: ${
              res.body.detail ?? res.body
            }`
          );
        }
        const d = JSON.parse(res.body);
        config.APPD_TOKEN = d.access_token;
        console.log(`config.APPD_TOKEN=${config.APPD_TOKEN}`);
        resolve(d);
      }
    );
  });
};

const appdcontroller_get = (url, pOpts, onresults) => {
  function _get(resolve, reject) {
    console.info(`Starting... - GET ${url}`);
    request.get(url, get_opts(pOpts), function (err, res) {
      console.info(`Done. - GET ${url}`);
      method_done(err, res, resolve, reject, onresults);
    });
  }
  return promise(_get);
};

const appdcontroller_post = (url, pOpts, onresults, body) => {
  function _post(resolve, reject) {
    console.info(`Starting... - POST ${url}`);
    request.post({
      url,
      headers: get_opts(pOpts).headers,
      callback: function (err, res) {
        console.info(`Done. - POST ${url}`);
        method_done(err, res, resolve, reject, onresults);
      },
      body: JSON.stringify(body),
    });
  }
  return promise(_post);
};

const get_opts = (pOpts) => {
  return {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${config.APPD_TOKEN}`,
      ...pOpts,
    },
  };
};

const method_done = (err, res, resolve, reject, onresults) => {
  if (err) return reject(err);
  console.info(`status code: ${res.statusCode}`);
  const statusCode = Number.parseInt(res.statusCode);
  if (isNaN(res.statusCode) || statusCode < 200 || statusCode > 299) {
    console.error("FALHA INTERNA NO SERVIDOR REMOTO");
    return reject(
      `status code: ${res.statusCode}, message: ${res.body.detail ?? res.body}`
    );
  }
  resolve(onresults(res));
};

const promise = (_call) => {
  return new Promise((resolve, reject) => {
    if (typeof config.APPD_TOKEN === "undefined")
      auth()
        .then(() => _call(resolve, reject))
        .catch(reject);
    else _call(resolve, reject);
  });
};

///controller/rest/applications/3/nodes/Node_8001
module.exports = {
  /**
   * Obtem detalhes do nó no Controller do AppDynamics
   * @param {String} application_name Nome/Id da aplicação no AppDynamics
   * @param {String} node_name Nome/Id do nó no AppDynamics
   * @returns
   */
  getNode: async (application_name, node_name) => {
    return await appdcontroller_get(
      `${base_url}rest/applications/${application_name}/nodes/${node_name}?output=JSON`,
      {},
      (res) => JSON.parse(res.body)
    );
  },
  isEUMWebEnabled: async (applicationId) => {
    return await appdcontroller_get(
      `${base_url}restui/eumConfigurationUiService/isEUMWebEnabled/${applicationId}`,
      {},
      (res) => res.body === "true"
    );
  },
  getCodeSnippet: async (applicationId) => {
    let result = await appdcontroller_post(
      `${base_url}restui/v2/browserRUMConfig/generateCodeSnippet/${applicationId}`,
      {
        "Content-Type": "application/json",
      },
      (res) => JSON.parse(res.body).value,
      {
        hostOption: 0,
        useRelativeUrl: false,
        adrumExtUrlHttp: null,
        adrumExtUrlHttps: null,
        useHTTPSByDefault: false,
        hideUrlQueryString: false,
        useStrictDomainCookies: false,
        enableConfigureResTiming: true,
        sampler: null,
        maxNum: null,
        bufSize: 200,
        clearResTimingOnBeaconSend: true,
        enableConfigureGeo: false,
        localIP: null,
        enableCityRegionCountry: false,
        city: null,
        region: null,
        country: null,
        enableConfigureUrlLength: true,
        maxResUrlSegmentLength: null,
        maxResUrlSegmentNumber: null,
        maxUrlLength: 512,
        longStackTrace: true,
        releaseId: null,
        enableMonitorFetch: true,
        isZoneOrAngular: false,
        setAjaxRequestLimit: false,
        maxPerPageView: null,
        unlimitedPerPageView: false,
        filterXhrs: false,
        xhrIncludeRules: null,
        xhrExcludeRules: null,
        enableXd: false,
        enableGeoResolverUrl: false,
        geoResolverUrlHttp: null,
        geoResolverUrlHttps: null,
        customConfig: "",
        captureTitle: true,
        enableSpa2: false,
        setCustomPageName: false,
        clearResTimingSpa2: false,
        enableFilterVirtualPages: false,
        customPageTitle: null,
        virtualPageExcludeRules: null,
        customPageName: null,
        customPageTitleV2: "",
        enableCustomConfig: false,
      }
    );
    return result;
  },
};
