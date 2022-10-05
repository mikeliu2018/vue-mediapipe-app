const { defineConfig } = require("@vue/cli-service");
const path = require("path");

module.exports = defineConfig({
  // transpileDependencies: true,
  transpileDependencies: ["vuex-persist"],
  devServer: {
    server: "https",
    proxy: {
      "/api": {
        target: "http://vue-mediapipe-backend:3000",
        pathRewrite: { "^/api": "" },
      },
    },
    open: true,
    compress: true,
    hot: true,
    allowedHosts: "all",
    historyApiFallback: true,
    port: 8080,
    host: "0.0.0.0",
    // https: true,
    static: {
      directory: path.resolve(__dirname, "./"),
      staticOptions: {},
      watch: true,
    },
  },
});
