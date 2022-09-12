const request = require('request');
module.exports = {

    configure: (base_url, username, password) => {

        const options = {
            auth: {
                user: username,
                password: password
            },
            headers: {
                'Accept': `application/json`,
                'Content-Type': 'application/json',
                'X-Requested-By': 'MyClient'
            }
        }

        console.log('vai')

        return {
            get: (path) => {
                return new Promise((resolve, reject) => {
                    try {
                        const url = `${base_url}${path}`;
                        console.info(`Starting... - GET ${url}`);
                        request(
                            { ...options, url: url },
                            function (err, res, body) {
                                console.info(`Done. - GET ${url}`);
                                if (err) return reject(err);
                                console.info(`status code: ${res.statusCode}`);
                                if (res.statusCode < 200 || res.statusCode > 299) {
                                    console.error('FALHA INTERNA NO SERVIDOR REMOTO')
                                    return reject(`status code: ${res.statusCode}, message: ${res.body.detail ?? res.body}`)
                                }
                                //console.info(res.body)
                                resolve(JSON.parse(res.body));
                            }
                        );
                    }
                    catch (ex00) {
                        console.error('>>>>REJECT')
                        reject(ex00);
                    }
                });
            },
            post: (path) => {
                return new Promise((resolve, reject) => {
                    try {
                        const url = `${base_url}${path}`;
                        console.info(`Starting... - POST ${url}`);
                        request.post(
                            { ...options, url: url, body: JSON.stringify({}) },
                            function (err, res, body) {
                                console.info(`Done. - POST ${url}`);
                                if (err) return reject(err);
                                console.info(`status code: ${res.statusCode}`);
                                if (res.statusCode < 200 || res.statusCode > 299) {
                                    console.error('FALHA INTERNA NO SERVIDOR REMOTO')
                                    return reject(`status code: ${res.statusCode}, message: ${res.body.detail ?? res.body}`)
                                }
                                //console.info(res.body)
                                resolve(JSON.parse(res.body));
                            }
                        );
                    }
                    catch (ex00) {
                        //resolve({ok:true})
                        reject(ex00);
                    }
                });
            }
        }
    }
}