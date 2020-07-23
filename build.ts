
// build global data + grab data from api
import { copyRemainingFiles, renderGenericPages, renderStaticPages, TemplateData } from './utils';

const templateData: TemplateData = {
    name: 'Chattycat',
    title: 'Chattycat',
    pages: [],
    generics: {
        books: [
            {
                name: 'Cléo Lefort',
                slug: 'cleo-lefort'
            }
        ]
    }
};

// build standard pages
renderStaticPages('src/pages', templateData);

// build generic pages
renderGenericPages('src/generics', templateData);

// copy remaining files
copyRemainingFiles();
