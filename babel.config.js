module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // react-native-reanimated/plugin wajib di paling akhir
      'react-native-reanimated/plugin',
    ],
  };
};
