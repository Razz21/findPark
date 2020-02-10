const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const isProd = process.env.NODE_ENV === "production";
module.exports = {
  devServer: {
    port: 8080
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/assets/scss/main.scss";`
      }
    }
  },
  configureWebpack: {
    devtool: "source-map",
    optimization: {
      splitChunks: {
        chunks: "all"
      },
      minimizer: isProd
        ? [
            new UglifyJsPlugin({
              uglifyOptions: {
                compress: {
                  drop_console: true
                }
              }
            })
          ]
        : []
    }
  }
};
