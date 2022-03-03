const path = require('path');
const webpack = require('webpack');

module.exports = {
  staticDirs: ['../public'],
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    { 
      name: "@storybook/preset-create-react-app",
      options:{ 
        craOverrides: {
          fileLoaderExcludes: ['less','css']
        }
      }
    }
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "webpack5"
  },
  "webpackFinal": async (config, { configType }) => {

    config.resolve.fallback = { ...config.resolve.fallback, 
      process: require.resolve("process/browser"),
      zlib: require.resolve("browserify-zlib"),
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util"),
      buffer: require.resolve("buffer"),
      asset: require.resolve("assert"),
    };
    
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
        process: "process/browser",
      }),
    );

    config.module.rules.push(
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              outputPath: 'src/fonts/'
            }
          }
        ],
        include: path.resolve(__dirname, '../src/xxx'),
      },

      {
        test: /\.css$/,
        use: [
          'postcss-loader',
          'style-loader',
        ],
        include: path.resolve(__dirname, '../src/xxx'),
      },
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            loader: 'less-loader',
            options: { 
              
              lessOptions: { 
                modifyVars: {
                  hack: `true; @import "${path.resolve(
                    __dirname,
                    "../src/styles",
                    "theme.less"
                  )}";`
                },
                javascriptEnabled: true } 
              },
          }
        ],
        include: path.resolve(__dirname, '../src/'),
      }
    );

    // Return the altered config
    return config;
  }
}