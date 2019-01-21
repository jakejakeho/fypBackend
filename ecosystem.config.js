module.exports = {
  apps : [{
    name: 'fypBackend',
    script: 'server.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 4,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
	  HTTP_PORT: '80',
	  HTTPS_PORT: '443',
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'depoly',
      host : 'FYPBACKEND.MOOO.COM',
      ref  : 'origin/master',
      repo : 'hojakejake@github.com:fypBackend.git',
      path : '/var/www/fypBackend',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
