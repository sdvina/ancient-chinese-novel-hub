import * as path from "path"
import { fromMeta } from "dirname_deno"

const { __dirname, __filename } = fromMeta(import.meta)

const PREV_DIR = ".."

export const NOVEL_DIR = path.join(__dirname, PREV_DIR, "novels")

export const NOVEL_SRC_DIR = path.join(__dirname, "novel")

export const WIKISOURCE_URL = "https://zh.wikisource.org"

export const MD_SUFFIX = ".md"

export const MD_TITLE_TOP = "# "

export const MD_TITLE_SECONDARY = "## "

export const MD_TITLE_THIRD = "### "