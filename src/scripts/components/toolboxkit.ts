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

    parseHeteronym(response) {
        let temp = ""
        for (const heteronym of response.heteronyms) {
            temp = temp +`${heteronym.bopomofo} ${heteronym.bopomofo2}\n
        `
            for (const definition of heteronym.definitions) {
                temp = temp + `  ${definition.type} ${definition.def}\n
          `
            }
        }
        return temp
    }

    attachTooltip(targetElement: HTMLElement, message?: string) {
        targetElement.addEventListener("mouseup", (event) => {
            const selection = window.getSelection()
            if (selection && !selection.isCollapsed) {
                const xhr = new XMLHttpRequest()
                xhr.onreadystatechange = () =>  {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText)
                        this.tooltip.innerText = this.parseHeteronym(response)
                    }
                }
                xhr.open('GET', 'https://www.moedict.tw/uni/' + selection + '.json')
                xhr.send()
                if (this.popper) {
                    this.popper.update()
                } else {
                    this.popper = createPopper(event.target, this.tooltip, {
                        placement: "bottom",
                        modifiers: {
                            //display: "block",
                            preventOverflow: {
                                enabled: true,
                                boundariesElement: "article"
                            }
                        }
                    })
                    // 获取选中文本的坐标
                    const range = selection.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    // 设置提示框的位置
                    this.tooltip.style.top = `${rect.top - this.tooltip.offsetHeight}px`
                    this.tooltip.style.left = `${rect.left + (rect.width / 2) - (this.tooltip.offsetWidth / 2)}px`
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