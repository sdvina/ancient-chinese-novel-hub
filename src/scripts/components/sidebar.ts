

export class Sidebar {
    button: HTMLElement
    constructor(sidebarSelector: string) {
        this.button = document.querySelector(sidebarSelector)
        if (!this.button) {
            throw new Error(`Sidebar element not found for selector ${sidebarSelector}`)
        }
        this.button.addEventListener("click", () => {
            this.button.classList.toggle("active")
        })
        document.addEventListener("click", (e) => {
            if (!this.button.contains(e.target)) {
                this.button.classList.remove("active")
            }
        })
    }

    addEventListeners(nodeList, event, fn) {
        [].forEach.call(nodeList, (elm) => {
            elm.addEventListener(event, fn, false)
        }, false)
    }

    restoreOption(itemName, className, elm) {
        const storedValue = localStorage.getItem(itemName)
        if (storedValue) {
            for (let element of document.getElementsByClassName(className)) {
                element.checked = (storedValue === element.value)
            }
            elm.setAttribute(itemName, storedValue)
        }
    }
}
