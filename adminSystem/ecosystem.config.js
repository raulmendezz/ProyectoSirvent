module.exports = {
  apps: [
    {
      name: 'sirvent-api',
      cwd: '/var/www/ProyectoSirvent/adminSystem/apps/api',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
    },
    {
      name: 'sirvent-dashboard',
      cwd: '/var/www/ProyectoSirvent/adminSystem/apps/admin-dashboard',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
