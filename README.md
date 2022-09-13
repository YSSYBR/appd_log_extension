# Appdynamics Logfiles Extension

This extension works only with the standalone machine agent. It has been tested against various processes with different execution parameters.

## Instalador Windows

Esse arquivo exemplifica e detalha como instalar a solução em uma máquina com sistema operacional Windows.

### Configurando o agent

Copie o arquivo `config.example.json` para um arquivo chamado `config.json` e escreva as configurações de acordo com seu servidor Weblogic

| Variável           | Descrição                                                   |
| ------------------ | ----------------------------------------------------------- |
| DEVELOPMENT        | Se estiver `true` é usado o script de desenvolvimento       |
| DEVELOPMENT_SCRIPT | Script para ser injetado no modo de desenvolvimento         |
| PORT               | Porta que vai rodar a aplicação                             |
| INTERVAL           | Intervalo de tempo em que vai acontecer a injeção de script |
| WL_PROTOCOL        | Protocolo do servidor Weblogic                              |
| WL_HOSTNAME        | Host do servidor Weblogic                                   |
| WL_PORT            | Porta do servidor Weblogic                                  |
| WL_USERNAME        | Usuário do Weblogic                                         |
| WL_VERSION         | Versão do Weblogic                                          |
| APPD_USERNAME      | Nome de usuário do App Dynamics                             |
| APPD_PASSWORD      | Senha de usuário do App Dynamics                            |
| APPD_PROTOCOL      | Protocolo do App Dynamics                                   |
| APPD_HOSTNAME      | Host do App Dynamics                                        |
| APPD_PORT          | Porta do App Dynamics                                       |
| APPD_SECRET        | ?                                                           |

### Selecionando os aplicativos

O arquivo `apps.json` contém uma lista de aplicativos 1 pra 1 do Weblogic para o App Dynamics, utilize o nome do aplicativo do Weblogic e o ID do aplicativo do App Dynamics.

```
{
    "webLogicAppName": "aplicativo_do_weblogic", "appId": "61"
}
```

### Iniciando a instalação

Execute como administrador o arquivo `warman-windows.bat`

O arquivo vai ser instalado na pasta padrão `C:/src/warman`

## Executar no docker

Inicie executando no terminal `cd container/warman`

### Configurando o agent

Dentro da pasta `container/warman`

Copie o arquivo `config.example.json` para um arquivo chamado `config.json` e escreva as configurações de acordo com seu servidor Weblogic

| Variável           | Descrição                                                   |
| ------------------ | ----------------------------------------------------------- |
| DEVELOPMENT        | Se estiver `true` é usado o script de desenvolvimento       |
| DEVELOPMENT_SCRIPT | Script para ser injetado no modo de desenvolvimento         |
| PORT               | Porta que vai rodar a aplicação                             |
| INTERVAL           | Intervalo de tempo em que vai acontecer a injeção de script |
| WL_PROTOCOL        | Protocolo do servidor Weblogic                              |
| WL_HOSTNAME        | Host do servidor Weblogic                                   |
| WL_PORT            | Porta do servidor Weblogic                                  |
| WL_USERNAME        | Usuário do Weblogic                                         |
| WL_VERSION         | Versão do Weblogic                                          |
| APPD_USERNAME      | Nome de usuário do App Dynamics                             |
| APPD_PASSWORD      | Senha de usuário do App Dynamics                            |
| APPD_PROTOCOL      | Protocolo do App Dynamics                                   |
| APPD_HOSTNAME      | Host do App Dynamics                                        |
| APPD_PORT          | Porta do App Dynamics                                       |
| APPD_SECRET        | ?                                                           |

Configure também o `.env`

| Variável        | Descrição                                   |
| --------------- | ------------------------------------------- |
| Wl_HOST_NAME    | Host do servidor Weblogic                   |
| WL_HOST_ADDRESS | Endereço ip do host do Weblogic             |
| WL_PORT         | Porta que roda o servidor Weblogic          |
| ORACLE_DISK_SRC | Disco em que encontra o caminho do Weblogic |

### Selecionando os aplicativos

Dentro da pasta `container/warman`

O arquivo `apps.json` contém uma lista de aplicativos 1 pra 1 do Weblogic para o App Dynamics, utilize o nome do aplicativo do Weblogic e o ID do aplicativo do App Dynamics.

```
{
    "webLogicAppName": "aplicativo_do_weblogic", "appId": "61"
}
```

### Iniciando a instalação

Execute no terminal `docker-compose up -d`
