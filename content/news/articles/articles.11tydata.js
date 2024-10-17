module.exports = {
    permalink: function(data) {
        return `/${data.page.date.toISOString().split('T')[0].replace(/-/g, '/')}/${data.page.fileSlug}/`;
    }
};