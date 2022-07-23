import type { PlasmoContentScript } from "plasmo"
export const config: PlasmoContentScript = {
  matches: ["https://www.plasmo.com/*", "https://*.juejin.cn/*"]
}

class ChangeColor {
  theme: string = "light"
  observerObject: any = null
  constructor() {
    console.log("初始化")
    this.init()
  }
  init() {
    chrome.runtime.sendMessage({}, (res) => {
      const { theme } = res
      this.switchTheme(theme)
    })
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      sendResponse('得到了结果');
      const { theme } = request;
      this.switchTheme(theme);
    });
  }
  private setDarkColor() {
    document.querySelector("body").classList.add("blackBackground")
    document.querySelector("#juejin header") &&
      document.querySelector("#juejin header").classList.add("blackBackground")
    document.querySelector("#juejin header.list-header") &&
      document
        .querySelector("#juejin header.list-header")
        .classList.add("blackBackground")
    if (this.observerObject) {
      this.observerObject.disconnect()
    }
    this.observeDom()
    const elements = document.querySelectorAll(
      '.entry-list-wrap .entry-list .entry, .entry-list-wrap .entry-list'
    );
    if (elements) {
      this.setColor(elements);
    }
  }
  setLightColor() {
    document.querySelector('body').classList.remove('blackBackground');
    document.querySelector('#juejin header') &&
      document
        .querySelector('#juejin header')
        .classList.remove('blackBackground');
    document.querySelector('#juejin header.list-header') &&
      document.querySelector('#juejin header.list-header').classList.remove('blackBackground');
    if (this.observerObject) {
      this.observerObject.disconnect();
    }
    this.observeDom();
    const elements = document.querySelectorAll(
      '.entry-list-wrap .entry-list .entry, .entry-list-wrap .entry-list'
    );
    if (elements) {
      this.setColor(elements);
    }
  }
  private switchTheme(reqTheme) {
    this.theme = reqTheme

    if (reqTheme == "dark") {
      this.setDarkColor()
    } else {
      // this.setLightColor();
    }
  }
  private observeDom() {
    var targetNode = document.querySelector("#juejin .entry-list-wrap")
    var observerOptions = {
      childList: true // 观察目标子节点的变化，是否有添加或者删除
    }
    this.observerObject = new MutationObserver(this.callback)
    this.observerObject.observe(targetNode, observerOptions)
  }
  private callback(mutationList, observer) {
    mutationList.forEach((mutation) => {
      switch (mutation.type) {
        case "childList":
          const elements = document.querySelectorAll(
            ".entry-list-wrap .entry-list .entry, .entry-list-wrap .entry-list"
          )
          if (elements) {
            this.setColor(elements)
          }
          break
      }
    })
  }
  private setColor(elements) {
    const doms = [...elements]
    for (const element of doms) {
      this.theme == "light"
        ? element.classList.remove("blackBackground")
        : element.classList.add("blackBackground")
    }
    this.setBeforeBackgroundColor()
  }
  private setBeforeBackgroundColor() {
    this.theme == "light"
      ? document.querySelector(".view-nav") &&
        document.querySelector(".view-nav").classList.remove("blackcolor")
      : document.querySelector(".view-nav") &&
        document.querySelector(".view-nav").classList.add("blackcolor")
  }
}
window.addEventListener("load", () => {
  console.log("content script loaded")
  const changeColor = new ChangeColor()
  
})