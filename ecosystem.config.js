module.exports = {
  apps: [
    {
      name: `vite-app`,
      script: 'serve',
      env: {
        PM2_SERVE_PATH: './dist',
        PM2_SERVE_PORT: process.env.PORT ? Number(process.env.PORT) : 5173,
        PM2_SERVE_SPA: 'true',
        NODE_ENV: 'production',
      },
    },
  ],
};
