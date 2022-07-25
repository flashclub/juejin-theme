import { useStorage } from "@plasmohq/storage"
import darkImage from "data-base64:~assets/dark.png"
import lightImage from "data-base64:~assets/light.png"
// export {}
console.log("HELLO WORLD FROM BGSCRIPTS")

class StartServer{
  localStorageData:string = 'light';

  constructor(){
    this.init()
  }
  init(){
    chrome.runtime.onInstalled.addListener( ()=> {
      chrome.storage.local.get(['theme'],  (res) => {
        if (res.theme) {
          this.localStorageData = res.theme;
        } else {
          this.setThemeMode('light');
          this.localStorageData = 'light';
        }
        this.listenIconClick()
      });
    });
    chrome.runtime.onMessage.addListener((req,sender, sendResponse) => {
      sendResponse({theme: this.localStorageData})
    })
  }
  listenIconClick() {
    console.log('逻辑中 chrome.action', chrome.action);
    chrome.action.onClicked.addListener( ()=> {
      console.log('逻辑中 localStorageData', this.localStorageData);
      this.localStorageData = this.localStorageData == 'light' ? 'dark' : 'light';
      const path = this.localStorageData == 'light' ? lightImage: darkImage
      this.setThemeMode(this.localStorageData);
      chrome.action.setIcon({ path });
      this.changeTabTheme()
    });
  }
  changeTabTheme(){
    chrome.tabs.query({},
      (tabs) => {
        for (var i = 0; i < tabs.length; i++) {
          console.log('获取url', tabs[i].url);
          try {
            const location = new URL(tabs[i].url)
            const host = location.host
            if (host.includes('juejin.cn')) {
              let message = {
                theme: this.localStorageData,
              };
              chrome.tabs.sendMessage(tabs[i].id, message, (res) => {
                console.log('background=>content');
                console.log(res);
              });
            }
          }
          catch (e) {
            console.log('报错',e);
          }
        }
      }
    );
  }
  setThemeMode(mode) {
    chrome.storage.local.set({ theme: mode }, function(){
      console.log('设置了theme', mode);
    });
  }
}
new StartServer()