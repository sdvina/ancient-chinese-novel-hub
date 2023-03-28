import { createPopper } from "https://esm.sh/@popperjs/core@2.11.6"
import { HTMLElement, document, window} from 'dom';

class TextTooltip {
    tooltip: HTMLElement;
    popper: any;

    constructor(tooltipSelector: string) {
        this.tooltip = document.querySelector(tooltipSelector);
        if (!this.tooltip) {
            throw new Error(`Tooltip element not found for selector ${tooltipSelector}`);
        }
    }

    attachTooltip(targetElement: HTMLElement, message: string) {
        targetElement.addEventListener('mouseup', () => {
            const selection = window.getSelection();
            if (selection?.toString()) {
                this.tooltip.innerText = message;
                if (this.popper) {
                    this.popper.update();
                } else {
                    this.popper = createPopper(targetElement, this.tooltip, {
                        placement: 'top',
                    });
                }
            } else {
                this.hideTooltip();
            }
        });
    }

    hideTooltip() {
        if (this.popper) {
            this.popper.destroy();
            this.popper = null;
        }
    }
}
``
// Example usage:
const tooltip = new TextTooltip('#my-tooltip')

tooltip.attachTooltip(
    document.querySelector('#my-text') as HTMLElement,
    'This is some helpful information'
)
