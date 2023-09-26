const DEBUG_ENVS = ['develop', 'local'];
const path = require('path');

module.exports = {
  i18n: {
    locales: ['default', 'en', 'ko'],
    defaultLocale: 'default',
    localeDetection: false,
  },
  reloadOnPrerender: DEBUG_ENVS.includes(process.env.ENV),
  debug: DEBUG_ENVS.includes(process.env.ENV),
  localePath: path.resolve('./public/static/locales'),
};
