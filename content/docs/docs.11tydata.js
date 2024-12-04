module.exports = {
  layout: "layouts/docs",
  sidenav: true,
  sidenavIdentifier: "docs",
  showtoc: true,
  permalink: function (data) {
    const fileName = data.page.inputPath
      .replace('content/', '')
      .split('.')
      .slice(0, -1)
      .join('.');
    return `/${fileName}/`;
  },
  eleventyComputed: {
    parent: (data) => {
      return data.page.inputPath.replace("./content/docs/", "").split("/")[0];
    }
  }
};