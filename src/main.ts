import { TextTooltip } from "./scripts/components/toolboxkit.ts"
import NovelFilter  from "./scripts/components/novelfilter.ts";
// Example usage:
const tooltip = new TextTooltip("#tooltip")
customElements.define("novel-filter", NovelFilter);

tooltip.attachTooltip(document.querySelector("#novel") as HTMLElement)
