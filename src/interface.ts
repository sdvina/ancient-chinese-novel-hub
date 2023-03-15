export type GetSpecifyData = (html: string) => Promise<any>

export interface Novel {
    name: string
    author: string
    dynasty: string
    md5: string | null
    url: string
    catalog?: Array<CatalogItem>
    chapter?: Array<ChapterItem>
}

export interface CatalogItem {
    no: string
    title: string
    url: string
}

export interface ChapterItem {
    no: string
    title: string
    section: Array<SectionItem>
}

export interface SectionItem {
    no: string
    content: string
}

export interface NovelCategory {
    name: string
    novels: Array<Novel>
}
