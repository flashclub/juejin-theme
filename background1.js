console.log('this is background1 6969');
// console.log('打印chrome.action', chrome.action);
console.log('加载插件localStorage22');
let localStorageData;

chrome.runtime.onInstalled.addListener(function () {
  console.log('插件安装了');
  setThemeMode('light');
  chrome.storage.local.get(['theme'], function (res) {
    console.log('缓存的res', res.theme);
    localStorageData = res.theme;
  });
  listenIconClick()
  // changeTabTheme()
});

chrome.runtime.onMessage.addListener((req,sender, sendResponse) => {
  sendResponse({theme: localStorageData})
})

function changeTabTheme(){
  chrome.tabs.query({},
    (tabs) => {
      for (var i = 0; i < tabs.length; i++) {
        console.log('获取url', tabs[i].url);
        try {
          const location = new URL(tabs[i].url)
          const host = location.host
          if (host.includes('juejin.cn')) {
            let message = {
              theme: localStorageData,
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

function listenIconClick() {
  console.log('获取 localStorageData', localStorageData);
  chrome.action.onClicked.addListener(function () {
    console.log('逻辑中 localStorageData', localStorageData);
    localStorageData = localStorageData == 'light' ? 'dark' : 'light';
    setThemeMode(localStorageData);
    chrome.action.setIcon({ path: 'icons/' + localStorageData + '.png' });
    // chrome.action.setIcon({ imageData:{'16': 'ww'} });
    changeTabTheme()
  });
}
function setThemeMode(mode) {
  chrome.storage.local.set({ theme: mode }, function(){
    console.log('设置了theme', mode);
  });

}
