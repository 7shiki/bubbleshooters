module.exports = {
    apps: [
      {
        name: 'bubbleshooters',
        script: 'npm',
        args: 'start',
        watch: false,
        instances: 1,
        env: {
          PORT: 3960
        }
      }
    ]
  }