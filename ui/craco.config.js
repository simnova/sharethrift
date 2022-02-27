const CracoLessPlugin = require('craco-less');
const webpack = require('webpack');
const path = require('path');
module.exports = {
  
  webpack: {
    configure: {
      resolve: {
        fallback: {
          process: require.resolve("process/browser"),
          zlib: require.resolve("browserify-zlib"),
          stream: require.resolve("stream-browserify"),
          util: require.resolve("util"),
          buffer: require.resolve("buffer"),
          asset: require.resolve("assert"),
        }
      },
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser",
        }),
      ]
    }
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {             
              hack: `true; @import "${path.resolve(
                __dirname,
                "./src/styles",
                "theme.less"
              )}";`
            },
            javascriptEnabled: true,
          },
        },
        postcssLoaderOptions:
        {
            plugins: [
                require('tailwindcss')('./tailwind.config.js'),
                require('autoprefixer')
            ]
        },
      },
    },
  ],
}