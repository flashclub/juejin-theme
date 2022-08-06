import type { PlasmoContentScript } from "plasmo"

import "./content.css"
import "./colors.css"

import { Storage } from "@plasmohq/storage"

export const config: PlasmoContentScript = {
  matches: ["https://*.juejin.cn/*"]
}

class ChangeColor {
  theme: string = "light"
  observerObject: any = null
  navObserver: any = null
  headerObserver: any = null
  config = require("./config.json")
  classList = Object.keys(this.config)
  storage: any = new Storage({ area: "local" })
  nowClass = {
    old: {
      background: "",
      fontcolor: "",
      img: ""
    },
    new: {
      background: "",
      fontcolor: "",
      img: ""
    }
  }
  alreadyInitOldType: boolean = false
  constructor() {
    console.log("初始化", this.config, this.classList)
    this.init()
  }
  async init() {
    const data = await this.getData("theme")
    // console.log('content theme data---', data);

    chrome.runtime.sendMessage({ theme: data }, async (res) => {
      // console.log('--content res--', res);

      const { theme } = res
      // console.log('获取 theme', theme);

      this.theme = theme
      this.nowClass.old = this.config.allThemeClass[theme]
      this.switchTheme()
    })
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      sendResponse("得到了结果")
      const { theme } = request
      // console.log("获取 theme", theme)

      this.theme = theme
      this.nowClass.old = JSON.parse(JSON.stringify(this.nowClass.new))
      this.switchTheme()
    })
  }
  async getData(key) {
    return await this.storage.get(key)
  }
  private switchTheme() {
    this.removeClassList()

    this.observeDom()
    this.checkNav()
    this.checkMainheader()
  }
  // 文章列表
  private observeDom() {
    // console.log("监听 list")

    var targetNode = document.querySelector("#juejin .entry-list-wrap")
    var observerOptions = {
      childList: true, // 观察目标子节点的变化，是否有添加或者删除
      subtree: true
    }
    if (!this.observerObject && targetNode) {
      this.observerObject = new MutationObserver(this.callback.bind(this))
      this.observerObject.observe(targetNode, observerOptions)
    }
  }
  private callback(mutationList, observer) {
    const that = this
    mutationList.forEach((mutation) => {
      switch (mutation.type) {
        case "childList":
          const allDom = this.selectMoreElement(
            "querySelectorAll",
            ".entry-list-wrap .entry-list .entry, .entry-list-wrap .entry-list"
          )
          const dom = this.selectMoreElement(
            "querySelector",
            "#juejin .entry-list-container"
          )
          const backgroundClass = this.nowClass.new.background
          const fontcolorClass = this.nowClass.new.fontcolor
          if (backgroundClass) {
            for (const element of allDom) {
              this.updateObserveElement(element, backgroundClass, "background")
            }
          }
          if (fontcolorClass) {
            this.updateObserveElement(dom, fontcolorClass, "fontcolor")
          }
          break
      }
    })
  }
  // 第二行nav
  private checkNav() {
    const targetNode = document.querySelector(
      "#juejin .view.timeline-index-view .view-nav"
    )
    const observerOptions = {
      attributes: true // 观察目标子节点的变化，是否有添加或者删除
    }
    const callback = function (mutationList) {
      mutationList.forEach((mutation) => {
        // console.log('----nav 变化了',mutation.target.classList)
        const background = this.nowClass.new.background
        if (background && !mutation.target.classList.contains(background)) {
          mutation.target.classList.toggle(this.nowClass.new.background)
        }
      })
    }
    if (!this.navObserver && targetNode) {
      this.navObserver = new MutationObserver(callback.bind(this))
      this.navObserver.observe(targetNode, observerOptions)
    }
  }
  private checkMainheader() {
    const targetNode = document.querySelector("#juejin .main-header")
    const observerOptions = {
      attributes: true // 观察目标子节点的变化，是否有添加或者删除
    }
    const callback = function (mutationList) {
      mutationList.forEach((mutation) => {
        // console.log('----header 变化了',mutation.target.classList)
        const background = this.nowClass.new.background
        if (background && !mutation.target.classList.contains(background)) {
          mutation.target.classList.toggle(this.nowClass.new.background)
        }
      })
    }
    if (!this.headerObserver && targetNode) {
      this.headerObserver = new MutationObserver(callback.bind(this))
      this.headerObserver.observe(targetNode, observerOptions)
    }
  }

  private removeClassList() {
    const theme = this.theme
    const config = this.config[theme]
    if (config.length) {
      for (const rules of config) {
        const { targetElementClassName, className = "", selector, type } = rules
        if (selector === "querySelector") {
          const targetElement = this.canRemoveClass(
            selector,
            targetElementClassName
          )
          // 旧的是dark 新的是 ''
          // 旧的是'' 新的是dark
          // 旧的是dark 新的是klean
          if (this.nowClass.old[type] !== className) {
            const oldClass = this.nowClass.old[type]
            oldClass && targetElement.classList.remove(oldClass)
          }
          if (className) {
            targetElement.classList.add(className)
          }
          this.nowClass.new[type] = className
        } else if (selector === "querySelectorAll") {
          const doms = this.selectMoreElement(selector, targetElementClassName)
          for (const element of doms) {
            this.updateObserveElement(element, className, type)
          }
        }
      }
    }
  }
  private updateObserveElement(element, className, type) {
    if (this.nowClass.old[type] !== className) {
      const oldClass = this.nowClass.old[type]
      oldClass && element.classList.remove(oldClass)
    }
    if (className) {
      element.classList.add(className)
    }
  }
  private selectMoreElement(selector, element) {
    
    const elements = document[selector](element)
    // console.log('选择element', selector, element, document[selector](element));
    if (selector === 'querySelector') {
      return elements
    } else {
      return [...elements]
    }
  }

  private canRemoveClass(selector, element) {
    return document[selector](element)
      ? document[selector](element)
      : document.querySelector("body")
  }
}
let oldHref = document.location.href
window.addEventListener("load", () => {
  console.log("content script loaded")
  const changeColor = new ChangeColor()
  var bodyList = document.querySelector("body")
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (oldHref != document.location.href) {
        oldHref = document.location.href
        /* Changed ! your code here */
        console.log("链接变了")
        const changeColor = new ChangeColor()
      }
    })
  })

  var config = {
    childList: true,
    subtree: true
  }
  observer.observe(bodyList, config)
})
