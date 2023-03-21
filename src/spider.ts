import axios from "redaxios"
import { GetSpecifyData } from "./interface.ts"
import { Any } from "encoding"

export default class Spider {

    // 获取页面 html 信息，通过 axios 请求
    getHtmlByAxios = async (url: string) => {
        try {
            const res = await axios.get(url)
            return res.data
        } catch (error){
            console.log(`ERROR when request ${url}`)
        }
    }

    // 获取
    getHtmlContent = async (url: string, getSpecifyData: GetSpecifyData): Promise<Array<Any>> => {
        // 1. 获取页面 html 信息
        console.log(`>>>Request ${url}<<<`)
        const html = await this.getHtmlByAxios(url)
        // 2. 获取对应标签内容信息（可以适当处理输入内容格式）
        const data = await getSpecifyData(html)
        // 3. 内容写入文件
        return data
    }
}