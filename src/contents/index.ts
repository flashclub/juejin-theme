import type { PlasmoContentScript } from "plasmo"

import "./content.css"

export const config: PlasmoContentScript = {
  matches: ["https://www.plasmo.com/*", "https://*.juejin.cn/*"]
}

class ChangeColor {
  theme: string = "light"
  observerObject: any = null
  config = require("./config.json")
  classList = Object.keys(this.config)
  nowClass = {}
  constructor() {
    console.log("初始化", this.config, this.classList)
    this.init()
  }
  init() {
    chrome.runtime.sendMessage({}, (res) => {
      const { theme } = res
      this.theme = theme
      this.switchTheme()
    })
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      sendResponse("得到了结果")
      const { theme } = request
      this.theme = theme
      this.switchTheme()
    })
  }
  private switchTheme() {
    this.removeClassList()
    if (this.observerObject) {
      this.observerObject.disconnect()
    }
    this.observeDom()
  }
  private observeDom() {
    var targetNode = document.querySelector("#juejin .entry-list-wrap")
    var observerOptions = {
      childList: true // 观察目标子节点的变化，是否有添加或者删除
    }
    this.observerObject = new MutationObserver(this.callback.bind(this))
    this.observerObject.observe(targetNode, observerOptions)
  }
  private callback(mutationList, observer) {
    const that = this
    mutationList.forEach((mutation) => {
      switch (mutation.type) {
        case "childList":
          const elements = document.querySelectorAll(
            ".entry-list-wrap .entry-list .entry, .entry-list-wrap .entry-list"
          )
          if (elements) {
            that.removeClassList()
          }
          break
      }
    })
  }

  private removeClassList(nowTargetElement?) {
    const theme = this.theme
    const config = this.config[theme]
    if (config.length) {
      for (const rules of config) {
        const { targetElementClassName, className, selector, type } = rules
        if (selector === "querySelector" || nowTargetElement) {
          const targetElement =
            nowTargetElement ||
            this.canRemoveClass(selector, targetElementClassName)
          this.nowClass[type] &&
            targetElement.classList.remove(this.nowClass[type])
          if (className) {
            this.nowClass[type] = className
            targetElement.classList.add(className)
          }
        } else if (selector === "querySelectorAll") {
          const doms = this.selectMoreElement(selector, targetElementClassName)
          for (const element of doms) {
            this.removeClassList(element)
          }
        }
      }
    }
  }
  private selectMoreElement(selector, element) {
    const elements = document[selector](element)
    return elements ? [...elements] : [document.querySelector("body")]
  }

  private canRemoveClass(selector, element) {
    return document[selector](element)
      ? document[selector](element)
      : document.querySelector("body")
  }
}
window.addEventListener("load", () => {
  console.log("content script loaded")
  const changeColor = new ChangeColor()
})
