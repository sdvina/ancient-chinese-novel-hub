import * as constant from "./constant.ts"
import * as helper from "./helper.ts";


function test(){
    helper.readNovelJsonFile(constant.NOVEL_SRC_DIR, "wikisource.json")
    console.log(constant.NOVEL_SRC_DIR + helper.getMD())
}

test()