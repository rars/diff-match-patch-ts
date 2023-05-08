const path = require("path");

//jshint strict: false
module.exports = function (config) {
  config.set({
    basePath: "",

    files: ["test/test.ts"],

    preprocessors: {
      "test/test.ts": ["webpack", "sourcemap"],
    },

    webpack: {
      // karma watches the test entry points
      // webpack watches dependencies
      devtool: "inline-source-map",
      output: {
        path: path.join(__dirname, "temp"),
      },
      resolve: {
        extensions: [".js", ".ts"],
      },
      module: {
        rules: [
          {
            test: /\.ts(x?)$/,
            loader: "ts-loader",
          },
        ],
      },
    },

    webpackMiddleware: {
      stats: "errors-only",
    },

    mime: {
      "text/x-typescript": ["ts", "tsx"],
    },

    frameworks: ["jasmine", "webpack"],

    plugins: [
      "karma-chrome-launcher",
      "karma-firefox-launcher",
      "karma-sourcemap-loader",
      "karma-webpack",
      "karma-jasmine",
      "karma-jasmine-html-reporter",
    ],

    reporters: ["dots", "kjhtml"],

    //port: 9876,
    colors: true,

    logLevel: config.LOG_INFO,

    browsers: ["ChromeHeadless"],

    captureTimeout: 60000,

    autoWatch: true,
    singleRun: false,
  });
};
