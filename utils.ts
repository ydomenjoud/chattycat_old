const fs = require('fs');
const fse = require('fs-extra')
const fg = require('fast-glob');
const path = require('path');
const pug = require('pug');

export interface TemplateData {
    name: string;
    title: string;
    pages: any[];
    generics: Record<string, { [key: string]: any, slug: string }[]>;
}

export function renderStaticPages(directory: string, templateData: TemplateData) {
    const pages: string[] = fg.sync(directory + '/*.pug', {onlyFiles: true});

    // on ajoute dans les templateData la liste des pages
    // pour construire la navigation par exemple
    templateData.pages = pages;

    pages.forEach(page => {
        // compile pug file to html
        const compiledHTML = pug.renderFile(page, templateData);
        page = page.replace(directory, 'public/');
        const filepath = path.dirname(page);
        const filename = path.basename(page, '.pug');
        // write file to disk
        fs.mkdirSync(filepath, {recursive: true});
        fs.writeFileSync(filepath + '/' + filename + '.html', compiledHTML);
    });
}


export function renderGenericPages(directory: string, templateData: TemplateData) {
    const genericsList: string[] = fg.sync(directory + '/*.pug', {onlyFiles: true});

    genericsList.forEach(genericFile => {
        const genericName = path.basename(genericFile, '.pug');
        const compiledFunction = pug.compileFile(genericFile);
        // on recherche dans la variable global si il y a un tableau qui existe pour ce générique
        (templateData.generics[genericName] || []).forEach(data => {
            const compiledHTML = compiledFunction({...templateData, current: data});

            const filepath = 'public/' + genericName;
            const filename = data.slug;

            fs.mkdirSync(filepath, {recursive: true});
            fs.writeFileSync(filepath + '/' + filename + '.html', compiledHTML);
        });
    });
}

export function copyRemainingFiles() {

    // copy assets
    fse.copySync('src/assets', 'public/assets');
}
