module.exports = {
  packagerConfig: {
    asar: false,
    ignore: [
      "^/src/",
      "^/dist/shortcuts/",
      "^/dist/banners/"
    ]
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        icon: "./dist/assets/img/Electron-logo.ico"
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ]
};
