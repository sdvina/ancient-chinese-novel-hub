import * as constant from "./constant.ts"
import * as helper from "./helper.ts"
import * as cheerio from "cheerio"
import Spider from "./spider.ts"
import * as path from "path"
import { EOL } from "std/fs"
import {
    CatalogItem,
    ChapterItem,
    SectionItem
} from "./interface.ts"

const getCatalog = (html: string): Promise<Array<CatalogItem>> => {

    const $ = cheerio.load(html)

    return new Promise((resolve, reject) => {
        const catalogEl = $("div.mw-parser-output > ul > li > a")
        if (catalogEl) {
            const catalog = new Array<CatalogItem>()
            let no = 1
            catalogEl.each((_, a) => {
                const title = $(a).text().trim()
                if (title.length > 0) {
                    catalog.push({
                        no: no.toString(),
                        title: title,
                        url: constant.WIKISOURCE_URL + $(a).attr('href')
                    })
                    no ++
                }
            })
            resolve(catalog)
        }
        reject('获取数据失败')
    })
}

export const getSection = (html: string): Promise<Array<SectionItem>> => {

    const $ = cheerio.load(html)

    return new Promise((resolve, reject) => {
        let sectionEl = $("div.mw-parser-output > p")
        const sectionEl2 = $("div.prose > p")
        if(sectionEl.length == 0) sectionEl = sectionEl2
        if (sectionEl.length > 0) {
            const section = new Array<SectionItem>()
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
        reject('获取数据失败')
    })
}

const run = async (fileName: string) => {

    const spider = new Spider()
    const categoryArray = await helper.readNovelJsonFile(constant.NOVEL_SRC_DIR, fileName)
    categoryArray.forEach(category => {
        // create category folder
        helper.makeDir(constant.NOVEL_DIR, category.name, true)
        const categoryDir = path.join(constant.NOVEL_DIR, category.name)
        category.novels.filter(novel => novel.reserved == false).forEach(async novel => {
            const catalog = await spider.getHtmlContent(novel.url, getCatalog)
            const chapter = new Array<ChapterItem>()
            const filePath = novel.name + constant.MD_SUFFIX
            helper.deleteFile(categoryDir, filePath)
            for (const catalogItem of catalog) {
                const i = catalog.indexOf(catalogItem);
                const section = await spider.getHtmlContent(catalogItem.url, getSection)
                chapter.push({
                    no: i.toString(),
                    title: catalogItem.title,
                    section: section
                })
                let chapterContent = constant.MD_TITLE_SECONDARY + catalogItem.title + EOL.LF + EOL.LF
                section.forEach(sectionItem => {
                    chapterContent = chapterContent + sectionItem.content + EOL.LF + EOL.LF
                })
                await helper.writeTextFile(categoryDir, filePath, chapterContent, true)
            }
        })
    })
}

await run("wikisource.json")