const extractHerokuDatabaseEnvVars = require('./util/extractHerokuDatabaseEnvVars');

extractHerokuDatabaseEnvVars();

const options = {};

if (process.env.NODE_ENV === 'production') {
  options.ssl = { rejectUnauthorized: false };
}

module.exports = options;

// if the environment is production, SSL do not verify certificate
