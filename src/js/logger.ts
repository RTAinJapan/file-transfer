import log4js from 'log4js';
import configModule from 'config';
const config: Config = configModule.util.toObject(configModule);

log4js.configure(config.log4js);

export default {
  system: log4js.getLogger('system'),
  access: log4js.getLogger('access'),
  console: log4js.getLogger('console'),
};
