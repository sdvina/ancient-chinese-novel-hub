import * as constant from "./constant.ts"
import * as helper from "./helper.ts"
import * as cheerio from "cheerio"
import Spider from "./spider.ts"
const getCatalog = (html: string): Promise<string> => {
    const $ = cheerio.load(html);

    return new Promise((resolve, reject) => {
        const catalog = $("div.mw-parser-output")?.children("ul").children("li").children("a")
        if (catalog) {
            for (let i = 0; i < catalog.toArray().length; i++) {
                const item = catalog.toArray()[i]
                console.log(item.data)
            }

            //console.log("", "", "", "")

            resolve("");
        }

        reject('获取数据失败');
    });
}

export const getNovelContent = (html: string): Promise<string> | null => {
    html
    return null
}

const run = () => {
    const categoryArray = helper.readNovelJsonFile(constant.NOVEL_SRC_DIR, "wikisource.json")
    if(categoryArray == null) return
    const spider = new Spider();
    for (let i = 0; i < categoryArray.length; i++) {
        //const categoryName = categoryArray[i].name
        const novels = categoryArray[i].novels
        for (let j = 0; j < novels.length; j++) {
            const novel = novels[j]
            spider.getHtmlContent(novel.url, getCatalog).then(value =>
                value.length
            )
        }

    }
}

run()