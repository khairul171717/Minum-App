module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // react-native-worklets/plugin wajib di paling akhir untuk Reanimated v4
      'react-native-worklets/plugin',
    ],
  };
};

