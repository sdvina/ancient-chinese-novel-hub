import * as constant from "./constant.js"
import * as helper from "./helper.js";


function test(){
    helper.readNovelJsonFile(constant.NOVEL_SRC_DIR, "wikisource.json")
    console.log(constant.NOVEL_SRC_DIR + helper.getMD())
}

test()