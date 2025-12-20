module.exports = {
  apps: [{
    name: "airlogbaru",
    script: "./server/server.js",
    env: {
      NODE_ENV: "production",
      PORT: 4002
    }
  }]
}
