import {
    copy,
    emptyDirSync,
    ensureDirSync
} from "std/fs"
import * as path from "path"
import MarkdownIt from "markdown-it"
import { NovelCategory } from "./interface.ts"

export const makeDir = (baseDir:string, dir: string, reserve: boolean) => {

    const dirPath = path.resolve(baseDir, dir)
    reserve ? ensureDirSync(dirPath) : emptyDirSync(dirPath)
}

export const writeFile = async (baseDir: string, filePath: string, data: string) => {

    const filePathResolved = path.resolve(baseDir, filePath)
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    try {
        await Deno.writeFile(filePathResolved, encodedData)
        console.log(`Data written to file ${filePath} successfully.`);
    } catch (error) {
        console.error(`Error writing data to file ${filePath}:`, error.message);
    }
}

export const writeTextFile = async (baseDir: string, filePath: string, data: string, append?: boolean) => {

    const filePathResolved = path.resolve(baseDir, filePath)
    try {
        await Deno.writeTextFile(filePathResolved, data, { append: append })
        console.log(`Data written to file ${filePath} successfully.`);
    } catch (error) {
        console.error(`Error writing data to file ${filePath}:`, error.message);
    }
}

export const readFile = (baseDir: string, filePath: string): Promise<Uint8Array> => {

    const filePathResolved = path.resolve(baseDir, filePath)
    return Deno.readFile(filePathResolved)
}

export const readTextFile = (baseDir: string, filePath: string): Promise<string> => {

    const filePathResolved = path.resolve(baseDir, filePath)
    return Deno.readTextFile(filePathResolved)
}

export const deleteFile = (baseDir: string, filePath: string) => {

    const filePathResolved = path.resolve(baseDir, filePath)
    Deno.removeSync(filePathResolved)
}

export const copyFile = async (
    baseSrcDir: string,
    baseDestDir: string,
    srcFile: string,
    destFile: string,
    reserve?: boolean
) => {

        const srcPath = path.resolve(baseSrcDir, srcFile)
        const destPath = path.resolve(baseDestDir, destFile)
        await copy(srcPath, destPath, {overwrite: reserve});
}

export const copyDir = async (
    baseSrcDir: string,
    baseDestDir: string,
    srcDir: string,
    destDir: string
) => {

    const srcPath = path.resolve(baseSrcDir, srcDir)
    const destPath = path.resolve(baseDestDir, destDir)
    await copy(srcPath, destPath)
}

export const readNovelJsonFile = (
    baseDir: string,
    filePath: string
): Promise<Array<NovelCategory>> => {

    return new Promise<Array<NovelCategory>>((resolve)=> {
        readTextFile(baseDir, filePath).then( jsonString =>
            resolve(JSON.parse(jsonString.toString()) as Array<NovelCategory>)
        )
    })
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
    })
    //md.use()
    console.log("create markdown-it: " + md)

    return md
}
