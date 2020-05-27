import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import * as colors from 'colors';

let snippet_log = function(msg) {
    console.log(`${"SNIPPET".green}: ${msg}`);
}

let snippets = {};
let langs = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../languages.json')).toString());

Object.keys(langs).forEach(lang => {
    snippets[lang] = []
});

let files = glob.sync(path.resolve(__dirname, '../snippets/**/*'));
files.forEach(file => {
    file = path.resolve(file);
    let language = path.basename(path.dirname(file)); /* Name of file's folder, AKA the name of the language. */
    let fn = path.basename(file); /* Name of file without directory name. */
    let lang = langs[language];
    if (language == 'snippets')
        return;
    else if (fs.lstatSync(file).isDirectory())
        return;

    if (lang === undefined)
        throw new Error(`Language ${language} does not exist.`);

    lang.forEach(ext => {
        fn = path.basename(fn, ext); /* Attempt to remove file extension. */
    });
    /* Add snippet to array. */
    snippets[language].push({
        Name: fn,
        Path: file
    });
});

let snippet = {
    languageExists(name: string) {
        return (snippets[name] !== undefined);
    },

    snippetExists(language: string, name: string) {
        if (!this.checkLanguage(name))
            throw new Error(`Language ${language} does not exist.`)
        else {
            let snips = this.getSnippetsByLanguage(language);
            let found = false;
            snips.forEach(s => {
                if (s.Name == name) {
                    found = true;
                }
            });

            return found;
        }
    },

    getSnippetsByLanguage(name: string) {
        if(!this.checkLanguage(name))
            throw new Error(`Language ${name} does not exist.`);
        else {
            var s = [];
            snippets[name].forEach(function(snippet) {
                if(snippet.Language == name) {
                    s.push(fs.readFileSync(snippet.Path).toString());
                }
            })
            return s;
        }
    },

    getSnippetByName(language: string, name: string) {
        if (!this.checkLanguage())
            throw new Error(`Language ${language} does not exist.`)
        else {
            var s = false;
            snippets[language].forEach(function(snip) {
                if(snip.Name == name) {
                    s = snip;
                }
            })

            return s;
        }
    },

    getSnippets() {
        return snippets;
    }
};

console.log(snippets);

module.exports = snippet;