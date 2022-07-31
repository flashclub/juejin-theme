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
      const data = await this.getData("theme")
      
      console.log("插件安装了 获取data", data )
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
  private setIcon() {
    const path = this.localStorageData == "light" ? lightImage : darkImage
    chrome.action.setIcon({ path })
  }
  async setThemeMode(mode) {
    await this.storage.set("theme", mode)
  }
}
new StartServer()
