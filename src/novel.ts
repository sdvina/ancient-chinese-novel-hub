import * as constant from "./constant.ts"
import * as helper from "./helper.ts"
import * as cheerio from "cheerio"
import Spider from "./spider.ts"
import {
    Novel,
    CatalogItem,
    ChapterItem,
    SectionItem
} from "./interface.ts"
import {WIKISOURCE_URL} from "./constant.ts";
const getCatalog = (html: string): Promise<Array<CatalogItem>> => {

    const $ = cheerio.load(html)

    return new Promise((resolve, reject) => {
        const catalogEl = $("div.mw-parser-output > ul > li > a")
        if (catalogEl) {
            let catalog = new Array<CatalogItem>()
            catalogEl.each((i, a) => {
                catalog.push({
                    no: i,
                    title: $(a).text(),
                    url: constant.WIKISOURCE_URL + $(a).attr('href')
                })
            })
            resolve(catalog)
        }
        reject('获取数据失败')
    })
}

export const getSection = (html: string): Promise<Array<SectionItem>> => {

    const $ = cheerio.load(html)

    return new Promise((resolve, reject) => {
        const sectionEl = $("div.mw-parser-output > p")
        if (sectionEl) {
            let section = new Array<SectionItem>()
            sectionEl.each((i, p) => {
                section.push({
                    no: i,
                    content: $(p).text()
                })
            })
            resolve(section)
        }
        reject('获取数据失败')
    })
}

const run = (fileName: string) => {
    helper.readNovelJsonFile(constant.NOVEL_SRC_DIR, fileName).then(categoryArray => {
        const spider = new Spider()
        categoryArray.forEach(category => {
            category.novels.forEach(novel => {

                spider.getHtmlContent(novel.url, getCatalog).then(catalog => {
                    console.log(catalog)
                    catalog.forEach( catalogItem => {
                        /*spider.getHtmlContent(catalogItem.url, getSection).then( section => {
                            console.log(section)
                        })*/
                        let section = await spider.getHtmlContent(catalogItem.url, getSection)
                    })
                })
            })
        })
    })
}

run("wikisource.json")