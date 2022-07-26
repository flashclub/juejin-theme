import type { PlasmoContentScript } from "plasmo"
import "./content.css"

// export const config: PlasmoContentScript = {
//   matches: ["https://www.plasmo.com/*", "https://*.juejin.cn/*"]
// }

class ChangeColor {
  theme: string = "light"
  observerObject: any = null
  config = require("./config.json")
  classList = Object.keys(this.config)
  nowClass = {
    old:{
      background:''
    },
    new:{
      background:''
    }
  }
  oldType = ''
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
      this.nowClass.old = JSON.parse(JSON.stringify(this.nowClass.new))
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
          console.log('运行callback');
          
          // if (elements) {
          //   that.removeClassList()
          // }
          const doms = this.selectMoreElement('querySelectorAll', ".entry-list-wrap .entry-list .entry, .entry-list-wrap .entry-list")
          const className = this.nowClass.new.background
          if (className) {
            
            for (const element of doms) {
              this.updateObserveElement(element, className, 'background')
            }
          }
          break
      }
    })
  }

  private removeClassList(nowTargetElement?, ownType?) {
    const theme = this.theme
    const config = this.config[theme]
    console.log('config 配置--', config, theme);
    if (config.length) {
      for (const rules of config) {
        const { targetElementClassName, className = '', selector, type } = rules
        if (selector === "querySelector" || nowTargetElement) {
          const targetElement =
            nowTargetElement ||
            this.canRemoveClass(selector, targetElementClassName)
          console.log('old ', this.nowClass.old[type]);
          console.log('now classname ', className);
          // 旧的是dark 新的是 ''
          // 旧的是'' 新的是dark
          // 旧的是dark 新的是klean
          if (this.nowClass.old[type] !== className) {
            const oldClass = this.nowClass.old[type]
            oldClass ? targetElement.classList.remove(oldClass): targetElement.classList.remove(className)
            console.log('移除 2 classname', targetElement.classList);
          }
          if (className) {
            targetElement.classList.add(className)
            this.nowClass.new[type] = className
          }
        } else if (selector === "querySelectorAll") {
          const doms = this.selectMoreElement(selector, targetElementClassName)
          for (const element of doms) {
            this.updateObserveElement(element, className, type)
          }
        }
      }
      
    }
  }
  private updateObserveElement(element, className, type){
    const oldClass = this.nowClass.old[type]
    oldClass && element.classList.remove(oldClass)
    if (className) { 
      element.classList.add(className)  
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
