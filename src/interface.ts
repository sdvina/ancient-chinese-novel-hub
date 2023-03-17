export type GetSpecifyData = (html: string) => Promise<any>

export interface Novel {
    name: string
    author: string
    dynasty: string
    url: string
    toc?: Array<TocItem>
    chapter?: Array<ChapterItem>
    reserved: boolean
}

export interface TocItem {
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
