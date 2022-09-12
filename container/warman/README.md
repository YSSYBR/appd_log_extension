# appd_lab_warman
Extensão para o AppDynamics que permite gerenciamento de agentes em soluções publicadas em formato WAR dentro de um servico WebLogic.

|**Parâmetro**|**Descrição**|**Obrigatório**|**Padrão**|
| --- | --- | --- | --- |
|APPD_PROTOCOL|Protocolo da url de comunicação com o serviço de RESTAPIs do Controller do AppDynamics|Sim|https
|APPD_HOSTNAME|Nome do host remoto/tenant do serviço de RESTAPIs do Controller do AppDynamics|Sim|yssysolucoes-nfr.saas.appdynamics.com
|APPD_PORT|Porta TCP do serviço de RESTAPIs do Controller do AppDynamics|Sim|443
|APPD_CLIENTID|_apiClientName_@_accountName_ para acesso ao serviço de RESTAPIs do Controller do AppDynamics|Sim|devyssy@yssysolucoes-nfr
|APPD_CLIENTSECRET|Client Secret de acesso ao serviço de RESTAPIs do Controller do AppDynamics|Sim|25be6745-bcef-4e84-a4c6-ed3572f0dcdf
|APPD_APPNAME|Nome da aplicacao no AppDynamics|Sim|appd_lab_maven5
|APPD_NODENAME|Nome do nó/servidor no AppDynamics|Sim|server1
|APPD_SCRIPT|Conteúdo a ser inserido ou removido do arquivo|Sim|\<script type="text/javascript">window.alert("SCRIPT INJETADO!!!");\</script>
|__WL_PORT__    | Porta TCP de comunicação com o serviço de RESTAPIs do WebLogic        | Sim |7001
|__WL_USERNAME__| Usuário de administração do WebLogic                                  | Sim |weblogic
|__WL_PASSWORD__| Senha do usuário de administração do WebLogic                         | Sim |yssy@dev
|__WL_APPNAME__ | Nome do aplicativo no WebLogic                                        | Sim |appd_lab_maven5
|__WL_VERSION__| Versão instalada do WebLogic | Sim |latest
|WL_PROTOCOL| Protocolo da url de comunicação com o serviço de RESTAPIs do WebLogic | Sim |http
|WL_HOSTNAME| Nome do host do serviço de RESTAPIs do WebLogic                       | Sim |localhost
