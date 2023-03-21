import * as constant from "./constant.ts"
import * as helper from "./helper.ts"
import * as cheerio from "cheerio"
import Spider from "./spider.ts"
import * as path from "path"
import { EOL } from "std/fs"
import {
    Category,
    Novel,
    TocItem,
    ChapterItem,
    SectionItem
} from "./interface.ts"

const getCategoryArray = (html: string): Promise<Array<Category>> => {

    const $ = cheerio.load(html)

    return new Promise((resolve, reject) => {
        const categoryNames = $("div.mw-parser-output > div:first > ul > li > a")
        if (categoryNames.length > 0) {
            const categoryArray = new Array<Category>()
            categoryNames.each((i, a) => {
                const categoryEl = $(`div.mw-parser-output > div:eq(${i + 1}) > ul > li > a`)
                const novelArray = new Array<Novel>()
                categoryEl.each((_, a2) => {
                    novelArray.push({
                        name: $(a2).text().trim(),
                        author: "",
                        dynasty: "",
                        url: constant.WIKISOURCE_URL + $(a2).attr("href"),
                        reserved: true
                    })
                })
                categoryArray.push({
                    name: $(a).text().trim(),
                    novels: novelArray
                })
            })
            resolve(categoryArray)
        }
        reject("Failure getting category array")
    })
}

const getToc = (html: string): Promise<Array<TocItem>> => {

    const $ = cheerio.load(html)

    return new Promise((resolve, reject) => {
        const tocEl = $("div.mw-parser-output > ul > li > a")
        if (tocEl) {
            const toc = new Array<TocItem>()
            let no = 1
            tocEl.each((_, a) => {
                const title = $(a).text().trim()
                if (title.length > 0) {
                    toc.push({
                        no: no.toString(),
                        title: title,
                        url: constant.WIKISOURCE_URL + $(a).attr("href")
                    })
                    no ++
                }
            })
            resolve(toc)
        }
        reject("Failure getting toc")
    })
}

export const getSection = (html: string): Promise<Array<SectionItem>> => {

    const $ = cheerio.load(html)

    return new Promise((resolve, reject) => {
        let sectionEl = $("div.mw-parser-output > h2, p")
        const sectionEl2 = $("div.prose > p")
        if(sectionEl.length == 0) sectionEl = sectionEl2
        if (sectionEl) {
            const section = new Array<SectionItem>()
            if($(p))
            let no = 1
            sectionEl.each((_, p) => {
                const content = $(p).text().trim()
                if (content.length > 0) {
                    section.push({
                        no: no.toString(),
                        content: content
                    })
                    no ++
                }
            })
            resolve(section)
        }
        reject("Failure getting section" + html)
    })
}

const generateMd = async (fileName: string) => {

    const spider = new Spider()
    const categoryArray = await helper.readNovelJsonFile(constant.NOVEL_SRC_DIR, fileName)
    categoryArray.forEach(category => {
        // create category folder
        helper.makeDir(constant.NOVEL_DIR, category.name, true)
        const categoryDir = path.join(constant.NOVEL_DIR, category.name)
        category.novels.filter(novel => novel.reserved == false).forEach(async novel => {
            const toc = await spider.getHtmlContent(novel.url, getToc)
            const chapter = new Array<ChapterItem>()
            const filePath = novel.name + constant.MD_SUFFIX
            helper.deleteFile(categoryDir, filePath)
            for (const tocItem of toc) {
                const i = toc.indexOf(tocItem);
                const section = await spider.getHtmlContent(tocItem.url, getSection)
                chapter.push({
                    no: i.toString(),
                    title: tocItem.title,
                    section: section
                })
                let chapterContent = constant.MD_TITLE_SECONDARY + tocItem.title + EOL.LF + EOL.LF
                section.forEach(sectionItem => {
                    chapterContent = chapterContent + sectionItem.content + EOL.LF + EOL.LF
                })
                await helper.writeTextFile(categoryDir, filePath, chapterContent, true)
            }
        })
    })
}

const generateWikisourceJson = (filePath: string) => {
    const spider = new Spider()
    spider.getHtmlContent("https://zh.wikisource.org/wiki/Portal:%E5%B0%8F%E8%AF%B4",
        getCategoryArray).then(async categoryArray => {
        console.log(categoryArray)
        await helper.writeTextFile(constant.NOVEL_SRC_DIR, filePath, JSON.stringify(categoryArray, null, 2))
    })
}


await generateMd("wikisource.json")

// generateWikisourceJson("wikisource.json")
