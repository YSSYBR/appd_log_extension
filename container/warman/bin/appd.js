require('appdynamics').profile({
    controllerHostName: 'yssysolucoes-nfr.saas.appdynamics.com',
    controllerPort: 443,
    controllerSslEnabled: true,  // Set to true if controllerPort is SSL
    accountName: 'appd_lab_maven5',
    accountAccessKey: 'oop98sx6odwm',
    applicationName: 'appd_lab_maven5',
    tierName: 'front_and_back',
    nodeName: 'server1'
});

