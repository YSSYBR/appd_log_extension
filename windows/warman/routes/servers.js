const express = require('express');
const apps    = require('../controllers/apps.js');
const servers = require('../controllers/servers.js');
const mcache  = require('memory-cache');

const router  = express.Router();
/* GET users listing. */
router.get('/', async function (req, res, next) {
  const data = await servers.list();
  res.send(data);
});

router.get('/:hostname/apps', function (req, res, next) {
  const from_cache = req.query.from_cache ?? true;
  const key = `__waman_apps_${req.params.hostname}`;
  if (from_cache) {
    let cachedBody = mcache.get(key);
    if (cachedBody)
      return res.send(cachedBody);
  }
  const server_apps = apps.listFromServer(req.params.hostname);
  if (from_cache) mcache.put(key, server_apps, 60000)
  return res.send(server_apps);
});

router.post('/:hostname/apps/:appname', async function (req, res, next) {
  try {
    const data = await apps.injectAppDScript(req.params.hostname, req.params.appname);
    return res.send(data);
  }
  catch (ex) {
    console.error('ERRO<<<<<<')
    return res.status(400).send(ex.toString());
  }
});

router.delete('/:hostname/apps/:appname', async function (req, res, next) {
  try {
    const data = await apps.removeAppDScript(req.params.hostname, req.params.appname);
    return res.send(data);
  }
  catch (ex) {
    console.error('ERRO<<<<<<')
    return res.status(400).send(ex.toString());
  }
});

module.exports = router;
