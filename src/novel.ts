import { TextTooltip } from "./scripts/components/toolboxkit.ts"
import { Sidebar } from "./scripts/components/sidebar.ts"

const $$root = document.getElementsByTagName('html')[0]
const $$main = document.getElementsByTagName('main')[0]
const sidebar = new Sidebar(".floating-button")
const tooltip = new TextTooltip("#tooltip")

tooltip.attachTooltip(document.querySelector("#novel") as HTMLElement)

sidebar.restoreOption("data-darkmode", "J_darkMode", $$root)
sidebar.restoreOption("data-bg-grid", "J_radioGrid", $$main)
sidebar.addEventListeners(document.getElementsByClassName("J_darkMode"), "change", function (e) {
    $$root.setAttribute('data-darkmode', e.target.value)
    localStorage.setItem('data-darkmode', e.target.value)
})
sidebar.addEventListeners(document.getElementsByClassName("J_radioGrid"), "change", function (e) {
    $$main.setAttribute("data-bg-grid", e.target.value)
    localStorage.setItem("data-bg-grid", e.target.value)
})