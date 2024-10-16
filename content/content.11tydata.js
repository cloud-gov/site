module.exports = {
    permalink: function(data) {
        const fileName = data.page.inputPath.replace('content/', '').split('.').slice(0, -1).join('.');
        return `/${fileName}/`;
    }
};