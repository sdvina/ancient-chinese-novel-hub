import { TextTooltip } from "./scripts/components/toolboxkit.ts"

// Example usage:
const tooltip = new TextTooltip("#tooltip")

tooltip.attachTooltip(
    document.querySelector(".container") as HTMLElement,
    'This is some helpful information'
)
