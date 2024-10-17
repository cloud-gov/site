module.exports = {
  permalink: function (data) {
    const fileName = data.page.inputPath.replace('content/', '').replace('articles/', '').split('.').slice(0, -1).join('.');
    return `/${fileName}/`;
  }
};