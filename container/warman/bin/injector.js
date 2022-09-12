const AdmZip = require("adm-zip");
const path = require("path");
const config = require("../config.json");
const uuid = require("uuid");
const fs = require("fs");
const cheerio = require("cheerio");
const _ENCODING = "utf8";

require("dotenv").config();

module.exports = (
  rootPath,
  originFile,
  appname,
  enabled,
  codeSnippet,
  resolve,
  reject,
  ignore
) => {
  // const extractedPath = extractWAR(originFile, tmpRootPath);

  if (enabled) {
    injectContentOnHtmlFiles(
      `${rootPath}/servers/AdminServer/tmp/_WL_user/` + appname,
      codeSnippet,
      () => {
        resolve();
      },
      reject,
      ignore
    );
  } else {
    removeContentOnHtmlFiles(
      `${rootPath}/servers/AdminServer/tmp/_WL_user/` + appname,
      codeSnippet,
      () => {
        resolve(originFile);
      },
      reject,
      ignore
    );
  }
  // if (enabled)
  //   injectContentOnHtmlFiles(
  //     extractedPath,
  //     codeSnippet,
  //     () => {
  //       compressWAR(extractedPath, originFile);
  //       resolve(originFile);
  //     },
  //     reject,
  //     ignore
  //   );
  // else
  //   removeContentOnHtmlFiles(
  //     extractedPath,
  //     codeSnippet,
  //     () => {
  //       compressWAR(extractedPath, originFile);
  //       resolve(originFile);
  //     },
  //     reject,
  //     ignore
  //   );
};

function extractWAR(filepath, tmpRootPath) {
  console.info(`extractWAR(${filepath})`);
  const outputDir = createOutputDir(tmpRootPath);
  const zip = new AdmZip(filepath);

  zip.extractAllTo(outputDir);

  console.log(`Extraído com sucesso em "${outputDir}"`);
  return outputDir;
}

function compressWAR(folderpath, outputFilePath) {
  const zip = new AdmZip();
  zip.addLocalFolder(folderpath);
  zip.writeZip(outputFilePath);

  console.log(`Compactado com sucesso em "${outputFilePath}"`);
  return outputFilePath;
}

function createOutputDir(basepath) {
  let outpath = null;
  do outpath = path.join(basepath, uuid.v4());
  while (pathExists(outpath));

  fs.mkdirSync(outpath);

  return outpath;
}

function pathExists(path) {
  return fs.existsSync(path);
}

function injectContentOnHtmlFiles(path, codeSnippet, resolve, reject, ignore) {
  const htmlFiles = findHtmlFiles(path);
  console.log({ path });
  console.log(htmlFiles);
  for (var x = 0; x < htmlFiles.length; x++) {
    const _filepath = htmlFiles[x];
    console.log(_filepath);
    fs.access(_filepath, fs.F_OK, (err) => {
      console.info(`${path} acessado`);
      try {
        if (err) {
          console.error(`Problemas ao ler o arquivo ${_filepath}`);
          console.error(err);
          return reject(`Problemas ao ler o arquivo ${_filepath}: ${err}`);
        }

        fs.readFile(_filepath, _ENCODING, (err, file_content) => {
          console.info(`${path} lido`);
          try {
            if (err)
              return reject(`Problemas ao ler o arquivo ${_filepath}: ${err}`);
            const html = file_content.toString(_ENCODING);
            console.info(codeSnippet);
            if (html.indexOf(codeSnippet) > -1) {
              console.warn(
                "script agente já existe no arquivo - nada será feito"
              );
              return ignore(_filepath);
            }

            inject(html, _filepath, codeSnippet).then(resolve).catch(reject);
          } catch (ex2) {
            console.error(ex2);
            return reject(`Erro na insercao do conteudo: ${ex2.toString()}`);
          }
        });

        //file exists
      } catch (ex1) {
        console.error(ex1);
        return reject(`Erro na insercao do conteudo: ${ex1.toString()}`);
      }
    });
  }
}

function removeContentOnHtmlFiles(path, codeSnippet, resolve, reject, ignore) {
  console.log(path);
  const htmlFiles = findHtmlFiles(path);
  console.log(htmlFiles);
  for (var x = 0; x < htmlFiles.length; x++) {
    const _filepath = htmlFiles[x];
    fs.access(_filepath, fs.F_OK, (err) => {
      console.info("arquivo acessado");
      try {
        if (err) {
          console.error(`Problemas ao ler o arquivo ${_filepath}`);
          console.error(err);
          return reject(`Problemas ao ler o arquivo ${_filepath}: ${err}`);
        }

        let file_content = fs.readFileSync(_filepath, _ENCODING);
        console.info("arquivo lido");
        try {
          if (err)
            return reject(`Problemas ao ler o arquivo ${_filepath}: ${err}`);
          const html = file_content.toString(_ENCODING);
          console.info(codeSnippet);
          if (html.indexOf(codeSnippet) === -1) {
            console.warn(
              "script agente não está presente no arquivo - nada será feito"
            );
            return ignore(_filepath);
          }

          remove(html, _filepath, codeSnippet).then(resolve).catch(reject);
        } catch (ex2) {
          console.error(ex2);
          return reject(`Erro na insercao do conteudo: ${ex2.toString()}`);
        }

        //file exists
      } catch (ex1) {
        console.error(ex1);
        return reject(`Erro na insercao do conteudo: ${ex1.toString()}`);
      }
    });
  }
}

function findHtmlFiles(startPath) {
  if (!fs.existsSync(startPath)) {
    console.log(`Diretório não existe: ${startPath}`);
    return;
  }

  var files = fs.readdirSync(startPath);
  var foundFiles = [];

  for (var i = 0; i < files.length; i++) {
    var filepath = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filepath);

    if (stat.isDirectory())
      foundFiles = foundFiles.concat(findHtmlFiles(filepath)); //recurse
    else if (
      filepath.toLowerCase().endsWith(".html") ||
      filepath.toLowerCase().endsWith(".htm")
    ) {
      console.log(`Arquivo encontrado: ${filepath}`);
      foundFiles.push(filepath);
    }
  }

  return foundFiles;
}

function inject(html, _filepath, codeSnippet) {
  return new Promise((resolve, reject) => {
    try {
      console.info("inject()");

      console.info(`Conteudo original: ${html.length} caracteres.`);
      const $ = cheerio.load(html);
      $("head").append(codeSnippet);
      // $("head").append(codeSnippet);
      const postcontent = $.html();
      console.info(`Conteudo a ser salvo: ${postcontent.length} caracteres.`);

      fs.writeFileSync(_filepath, postcontent, _ENCODING);

      try {
        console.log("Arquivo salvo.");
        resolve();
      } catch (ex3) {
        console.error(ex3);
        reject(`Erro na insercao do conteudo: ${ex3.toString()}`);
      }
    } catch (ex4) {
      console.error(ex4);
      reject(`Erro na insercao do conteudo: ${ex4.toString()}`);
    }
  });
}

function remove(html, _filepath, codeSnippet) {
  console.log({ codeSnippet });
  return new Promise((resolve, reject) => {
    try {
      console.info("remove()");

      const new_html = html.replace(codeSnippet, "");

      fs.writeFile(
        _filepath,
        new_html,
        _ENCODING,
        function (err, writtenbytes) {
          try {
            if (err) {
              console.error(err);
              return reject(
                `Não foi possível escrever no arquivo ${_filepath}: ${err.toString}`
              );
            } else {
              console.log("caracters removidos no arquivo");
              resolve();
            }
          } catch (ex3) {
            console.error(ex3);
            reject(`Erro na remoção do conteudo: ${ex2.toString()}`);
          }
        }
      );
    } catch (ex4) {
      console.error(ex4);
      reject(`Erro na insercao do conteudo: ${ex4.toString()}`);
    }
  });
}
