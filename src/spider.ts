import axios from "redaxios"
import superagent from "superagent"
import { GetSpecifyData} from "./interface.ts"

export default class Spider {

    // 获取页面 html 信息通过 superagent 库
    getHtmlBySuperagent = async (url: string) => {
        const res = await (superagent.get(url) as any);

        return res.text;
    }

    // 获取页面 html 信息，通过 axios 请求
    getHtmlByAxios = async (url: string) => {
        const res = await axios.get(url)

        return res.data;
    }

    // 获取
    getHtmlContent = async (url: string, getSpecifyData: GetSpecifyData): Promise<string> => {
        // 1. 获取页面 html 信息
        const html = await this.getHtmlByAxios(url)
        // 2. 获取对应标签内容信息（可以适当处理输入内容格式）
        const data = await getSpecifyData(html)
        // 3. 内容写入文件
        return data
    }
}