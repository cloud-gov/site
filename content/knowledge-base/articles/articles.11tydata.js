module.exports = {
    permalink: function(data) {
        return `/knowledge-base/${data.page.fileSlug}/`;
        // const fileName = data.page.inputPath.replace('content/', '').replace('articles/','').split('.').slice(0, -1).join('.');
        // return `/${fileName}/`;
    }
};