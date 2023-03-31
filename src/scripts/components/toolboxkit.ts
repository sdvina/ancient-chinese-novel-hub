import { createPopper } from "https://esm.sh/@popperjs/core@2.11.6"

export class TextTooltip {
    tooltip: HTMLElement
    popper: any

    constructor(tooltipSelector: string) {
        this.tooltip = document.querySelector(tooltipSelector)
        if (!this.tooltip) {
            throw new Error(`Tooltip element not found for selector ${tooltipSelector}`)
        }
    }

    moeUniToString(moeUni: MoeUni) : string {
        let temp = moeUni.title
        for (const heteronym of moeUni.heteronyms) {
            temp = temp +`\n${heteronym.bopomofo} ${heteronym.bopomofo2}\n`
            for (const definition of heteronym.definitions) {
                temp = temp + (definition.type ? `[${definition.type}] ${definition.def}\n` : `${definition.def}\n`)

            }
        }
        return temp
    }

    attachTooltip(targetElement: HTMLElement, message?: string) {
        targetElement.addEventListener("mouseup", (event) => {
            const selection = window.getSelection()
            // 获取选中文本的坐标
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            if (selection && !selection.isCollapsed) {
                const xhr = new XMLHttpRequest()
                xhr.onreadystatechange = () =>  {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText) as MoeUni
                        this.tooltip.innerText = this.moeUniToString(response)
                    }
                }
                xhr.open("GET", "https://www.moedict.tw/uni/" + selection + ".json")
                xhr.send()
                if (this.popper) {
                    this.popper.update()
                } else {
                    this.popper = createPopper(event.target, this.tooltip, {
                        placement: "bottom",
                        modifiers: {
                            preventOverflow: {
                                enabled: true,
                                boundariesElement: "article"
                            }
                        }
                    })
                    // 设置提示框的位置
                    this.tooltip.style.top = `${rect.top - this.tooltip.offsetHeight}px`
                    this.tooltip.style.left = `${rect.left + (rect.width / 4) - (this.tooltip.offsetWidth / 4)}px`
                    this.tooltip.setAttribute("data-show", "")
                }
            } else {
                this.hideTooltip()
            }
        })
    }

    hideTooltip() {
        if (this.popper) {
            this.popper.destroy()
            this.popper = null
        }
    }
}

interface  MoeUni {
    title: string
    stroke_count: number
    radical: string
    non_radical_stroke_count: number
    heteronyms: Array<Heteronym>
}

interface Heteronym {
    bopomofo: string
    bopomofo2: string
    definitions: Array<Definition>
}

interface Definition {
    def: string
    quote: Array<string>
    type?: string
}