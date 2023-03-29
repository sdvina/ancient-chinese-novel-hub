import { createPopper } from "https://esm.sh/@popperjs/core@2.11.6"

export class TextTooltip {
    tooltip: HTMLElement;
    popper: any;

    constructor(tooltipSelector: string) {
        this.tooltip = document.querySelector(tooltipSelector)
        if (!this.tooltip) {
            throw new Error(`Tooltip element not found for selector ${tooltipSelector}`)
        }
    }

    attachTooltip(targetElement: HTMLElement, message: string) {
        targetElement.addEventListener('mouseup', (event) => {
            const selection = window.getSelection()
            if (selection?.toString()) {
                this.tooltip.innerText = selection?.toString()
                if (this.popper) {
                    this.popper.update()
                } else {
                    this.popper = createPopper(targetElement, this.tooltip, {
                        placement: 'top',
                    })
                }
            } else {
                this.hideTooltip()
            }
        });
    }

    hideTooltip() {
        if (this.popper) {
            this.popper.destroy()
            this.popper = null
        }
    }
}