module.exports = function () {
  return {
    layout: "layouts/docs",
    sidenav: true,
    permalink: function (data) {
      const fileName = data.page.inputPath
        .replace('content/', '')
        .split('.')
        .slice(0, -1)
        .join('.');
      return `/${fileName}/`;
    }
  };
};