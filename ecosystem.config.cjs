module.exports = {
  apps: [
    {
      name: 'fe',
      script: 'npm',
      args: 'run start',
      instances: '1',
      exec_mode: 'fork', // if there is only one instance, use cluster otherwise
    },
  ],
};
