console.log('content-script');
let observerObject, theme;
//
function setBeforeBackgroundColor() {
  theme == 'light'
    ? document.querySelector('.view-nav') &&
      document.querySelector('.view-nav').classList.remove('blackcolor')
    : document.querySelector('.view-nav') &&
      document.querySelector('.view-nav').classList.add('blackcolor');
}

function setColor(elements) {
  const doms = [...elements];
  for (const element of doms) {
    theme == 'light'
      ? element.classList.remove('blackBackground')
      : element.classList.add('blackBackground');
  }
  setBeforeBackgroundColor();
}
function callback(mutationList, observer) {
  mutationList.forEach((mutation) => {
    switch (mutation.type) {
      case 'childList':
        const elements = document.querySelectorAll(
          '.entry-list-wrap .entry-list .entry, .entry-list-wrap .entry-list'
        );
        if (elements) {
          setColor(elements);
        }
        break;
    }
  });
}
function observeDom() {
  var targetNode = document.querySelector('#juejin .entry-list-wrap');
  var observerOptions = {
    childList: true, // 观察目标子节点的变化，是否有添加或者删除
  };
  observerObject = new MutationObserver(callback);
  observerObject.observe(targetNode, observerOptions);
}

function setDarkColor() {
  document.querySelector('body').classList.add('blackBackground');
  document.querySelector('#juejin header') &&
    document.querySelector('#juejin header').classList.add('blackBackground');
  document.querySelector('#juejin header.list-header') &&
    document.querySelector('#juejin header.list-header').classList.add('blackBackground');
  if (observerObject) {
    observerObject.disconnect();
  }
  observeDom();
  const elements = document.querySelectorAll(
    '.entry-list-wrap .entry-list .entry, .entry-list-wrap .entry-list'
  );
  if (elements) {
    setColor(elements);
  }
}
function setLightColor() {
  document.querySelector('body').classList.remove('blackBackground');
  document.querySelector('#juejin header') &&
    document
      .querySelector('#juejin header')
      .classList.remove('blackBackground');
  document.querySelector('#juejin header.list-header') &&
    document.querySelector('#juejin header.list-header').classList.remove('blackBackground');
  if (observerObject) {
    observerObject.disconnect();
  }
  observeDom();
  const elements = document.querySelectorAll(
    '.entry-list-wrap .entry-list .entry, .entry-list-wrap .entry-list'
  );
  if (elements) {
    setColor(elements);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse('得到了结果');
  const { theme } = request;
  switchTheme(theme);
});

function init() {
  chrome.runtime.sendMessage({}, (res) => {
    const { theme } = res;
    switchTheme(theme);
  });
}
init();
function switchTheme(reqTheme) {
  theme = reqTheme;

  if (theme == 'dark') {
    setDarkColor();
  } else {
    setLightColor();
  }
}
