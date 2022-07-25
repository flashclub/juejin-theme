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
  }
  init() {
    chrome.runtime.onInstalled.addListener(async () => {
      console.log('插件安装了');
      const data = await this.getData("theme")
      
      if (data) {
        this.localStorageData = data
      } else {
        await this.setThemeMode("light")
        this.localStorageData = "light"
      }
      this.setIcon()
      this.listenIconClick()
    })
    chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
      sendResponse({ theme: this.localStorageData })
    })
  }
  async getData(key) {
    return await this.storage.get(key)
  }
  listenIconClick() {
    // chrome.action.onClicked.addListener(async () => {
    //   this.localStorageData =
    //     this.localStorageData == "light" ? "dark" : "light"
    //   await this.setThemeMode(this.localStorageData)
    //   this.setIcon()
    //   this.changeTabTheme()
    // })
  }
  private setIcon() {
    const path = this.localStorageData == "light" ? lightImage : darkImage
    chrome.action.setIcon({ path })
  }
  changeTabTheme() {
    chrome.tabs.query({}, (tabs) => {
      for (var i = 0; i < tabs.length; i++) {
        console.log("获取url", tabs[i].url)
        try {
          const location = new URL(tabs[i].url)
          const host = location.host
          if (host.includes("juejin.cn")) {
            let message = {
              theme: this.localStorageData
            }
            chrome.tabs.sendMessage(tabs[i].id, message, (res) => {
              console.log("background=>content")
              console.log(res)
            })
          }
        } catch (e) {
          console.log("报错", e)
        }
      }
    })
  }
  async setThemeMode(mode) {
    await this.storage.set("theme", mode)
  }
}
new StartServer()
