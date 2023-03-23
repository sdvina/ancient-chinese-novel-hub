import rehypeRemark from 'https://esm.sh/rehype-remark@9'
import {unified} from 'https://esm.sh/unified'
import rehypeParse from 'https://esm.sh/rehype-parse'
import remarkStringify from 'https://esm.sh/remark-stringify'

await main()

async function main() {
    const response = await fetch('https://zh.wikisource.org/wiki/%E6%90%9C%E7%A5%9E%E8%A8%98')
    const file = await unified()
        .use(rehypeParse)
        .use(rehypeRemark)
        .use(remarkStringify)
        .process(await response.text())

    console.log(">>>>" + String(file))
}
