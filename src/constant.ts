import * as path from "path"
import { fromMeta } from "dirname_deno"

const { __dirname, __filename } = fromMeta(import.meta)

console.log(__dirname + ">>>>" + __filename)

const PREV_DIR = ".."

export const NOVEL_DIR = path.join(__dirname, PREV_DIR, "novel")

export const NOVEL_SRC_DIR = path.join(__dirname, "novel")

export const HTML_DIR = path.join(__dirname, PREV_DIR, "public", "built")

export const SCAFFOLD_INDEX = path.resolve(__dirname, PREV_DIR, "scaffold/index.html")

export const SCAFFOLD_CATALOG = path.resolve(__dirname, PREV_DIR, "scaffold/catalog.html")

export const SCAFFOLD_CHAPTER = path.resolve(__dirname, PREV_DIR, "scaffold/chapter.html")