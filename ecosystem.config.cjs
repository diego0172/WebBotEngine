module.exports = {
  apps: [{
    name: "web",
    cwd: "/opt/stack/web",
    script: "node",
    args: "src/server.js",
    env: { NODE_ENV: "production", PORT: 3000 }
  }]
}

