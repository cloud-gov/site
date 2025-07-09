const fs = require('fs');
const path = require('path');

// Config
const docsDir = './content/docs';
const pagesDir = './content/pages';
const newSiteUrl = 'https://docs.cloud.gov';

// output file
const outputFile = './_data/redirects.json';

function findMarkdownfiles(directory) {
    const files = [];

    if (!fs.existsSync(directory)) {
        return files;
        }

        function walkDirectory(dir) {
            const items = fs.readdirSync(dir);

            items.forEach(item => {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    walkDirectory(fullPath);
                } else if (item.endsWith('.md')) {
                    files.push(fullPath);
                }
             });
        }

        walkDirectory(directory);
        return files;
}

// Create redirects function
function generateRedirects() {
    const redirects = {};

    // Create _data directory if it doesn't exist
    if (!fs.existsSync('_data')) {
        fs.mkdirSync('_data');
    }

    // Find Platform docs
    const docsFiles = findMarkdownfiles(docsDir);

    docsFiles.forEach(file => {
        //Convert path using regex
        const urlPath = file
        .replace('./content/docs', '/docs')
        
        const destination = newSiteUrl + urlPath;
        redirects[urlPath] = destination;
    });

// Find Pages docs
const pagesFiles = findMarkdownfiles(pagesDir);

pagesFiles.forEach(file => {
    //Convert path using regex as above
    const urlPath = file
    .replace('./content/pages', '/pages')

    const destination = newSiteUrl + urlPath;
    redirects[urlPath] = destination;
});

//Automatically create the redirects file
fs.writeFileSync(outputFile, JSON.stringify(redirects, null, 2));
}

generateRedirects();