import {
    emptyDirSync,
    ensureDirSync,
    ensureFileSync,
    existsSync
} from "https://deno.land/std@0.179.0/fs/mod.ts"
import {
    StringReader,
    StringWriter
} from "https://deno.land/std@0.179.0/io/mod.ts"
import * as path from "path"
import MarkdownIt from "markdown-it"

export const makeDir = (baseDir:string, dir: string, reserve: boolean) => {
    const dirPath = path.resolve(baseDir, dir)
    if(reserve) ensureDirSync(dirPath)
    else emptyDirSync(dirPath)
}



export const secureWriteFile = (baseDir: string, filePath: string, data: Uint8Array): Promise<string> => {

    return new Promise((resolve) => {
        const filePathResolved = path.resolve(baseDir, filePath)
        if (!existsSync(filePathResolved)) {
            const dirName = path.dirname(filePathResolved)
            ensureFileSync(dirName)
            Deno.writeFileSync(filePathResolved, data)
            resolve("创建文件成功")
        } else {
            resolve("文件已存在")
        }
    })
}

export const secureReadFile = (baseDir: string, filePath: string): Promise<string> => {

    return new Promise((resolve, reject) => {
        const filePathResolved = path.resolve(baseDir, filePath)
        fs.readFile(filePathResolved, "utf8", (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data.toString())
            }
        });
    });
}

export const secureCopyFile = (baseSrcDir:string, baseDestDir:string, srcFile: string, destFile: string): Promise<string> => {

    return new Promise((resolve, reject) => {
        const srcPath = path.resolve(baseSrcDir, srcFile)
        const destPath = path.resolve(baseDestDir, destFile)

        if (!existsSync(srcPath)) {
            reject("Source file (${srcFile}) does not exist")
        }

        if (existsSync(destPath)) {
            reject("Destination file (${destFile}) already exists")
        }

        const srcStream = fs.createReadStream(srcPath)
        const destStream = fs.createWriteStream(destPath)

        srcStream.pipe(destStream);

        srcStream.on("error", (err) => {
            reject(err);
        });

        destStream.on("finish", () => {
            resolve("File copied successfully from ${srcFile} to ${destFile}")
        });
    });
}



interface Novel {
    name: string
    author: string
    dynasty: string
    md5: string | null
    url: string
}

interface NovelCategory {
    name: string;
    novels: Array<Novel>
}

export const readNovelJsonFile = (baseDir: string, filePath: string): Array<NovelCategory> | null => {

    let categoryArray = null
    try {
        const data = secureReadFile(baseDir, filePath)
        //const data = fs.readFileSync(filePath, 'utf8')
        data.then((value) => {
            categoryArray = JSON.parse(value) as Array<NovelCategory>
        })
        return categoryArray
    } catch (err) {
        console.error(err)

        return categoryArray
    }
}

export const getMD = (): MarkdownIt => {

    const md = new MarkdownIt({
        html: true,        // Enable HTML tags in source
        xhtmlOut: true,        // Use '/' to close single tags (<br />).
        // This is only for full CommonMark compatibility.
        breaks: false,        // Convert '\n' in paragraphs into <br>
        langPrefix: 'language-',  // CSS language prefix for fenced blocks. Can be
                                  // useful for external highlighters.
        linkify: true,        // Autoconvert URL-like text to links

        // Enable some language-neutral replacement + quotes beautification
        // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js
        typographer: false,

        // Double + single quotes replacement pairs, when typographer enabled,
        // and smartquotes on. Could be either a String or an Array.
        //
        // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
        // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
        quotes: '“”‘’',

        // Highlighter function. Should return escaped HTML,
        // or '' if the source string is not changed and should be escaped externally.
        // If result starts with <pre... internal wrapper is skipped.
        highlight: function (/*str, lang*/) {
            return ''
        }
    })
    //md.use()
    console.log("create markdown-it: " + md)

    return md
}
