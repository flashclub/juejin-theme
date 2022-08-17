import darkImage from "data-base64:~assets/dark.png"
import lightImage from "data-base64:~assets/light.png"

import { Storage } from "@plasmohq/storage"

// export {}
console.log("HELLO WORLD FROM BGSCRIPTS")

class StartServer {
  localStorageData: string = "light"
  storage: any = new Storage({ area: "local" })
  constructor() {
    this.init()
    this.relodPage()
  }
  init() {
    chrome.runtime.onUpdateAvailable.addListener(
      function(){
        chrome.runtime.reload()
      }
    )
    chrome.runtime.onInstalled.addListener(async () => {
      const data = await this.getData("theme")
      if (data) {
        this.localStorageData = data
      } else {
        await this.setThemeMode("light")
        this.localStorageData = "light"
      }
      this.setIcon()
      // this.listenIconClick()
    })
    chrome.runtime.onMessage.addListener( (req, sender, sendResponse) => {
      console.log('--data- 主题', req, this.localStorageData);
      const {theme} = req
      sendResponse({ theme: theme || this.localStorageData })
    })
  }
  async getData(key) {
    return await this.storage.get(key)
  }
  relodPage() {
    chrome.tabs.query({}, (tabs) => {
      for (var i = 0; i < tabs.length; i++) {
        try {
          const location = new URL(tabs[i].url)
          const host = location.host
          if (host.includes("juejin.cn")) {
            chrome.tabs.reload(tabs[i].id)
            console.log('初始化 刷新', tabs[i].id);
          }
        } catch (e) {
          console.log("报错--", e)
        }
      }
    })
  }
  private setIcon() {
    const path = this.localStorageData == "light" ? lightImage : darkImage
    chrome.action.setIcon({ path })
  }
  async setThemeMode(mode) {
    await this.storage.set("theme", mode)
  }
}
new StartServer()
