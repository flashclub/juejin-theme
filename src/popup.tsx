import { useState } from "react"
import { Storage, useStorage } from "@plasmohq/storage"
import {Helmet} from "react-helmet"
import "./popup.css"

function IndexPopup() {
  const [data, setData] = useState("")
  const storage = new Storage({ area:"local"})

  async function clickDark(theme) {
    console.log("点击了", theme)
    await storage.set("theme", theme)
    const msg = { theme }
    changeTabTheme(msg)
    // setData(theme)
  }
  function changeTabTheme(message) {
    chrome.tabs.query({}, (tabs) => {
      for (var i = 0; i < tabs.length; i++) {
        console.log("获取url", tabs[i].url)
        try {
          const location = new URL(tabs[i].url)
          const host = location.host
          if (host.includes("juejin.cn")) {
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
  return (
    <div>
      <Helmet>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <div className="w-80 grid grid-cols-2 gap-4 p-5 ">
        <div
          className="grow cursor-pointer flex items-center justify-center px-2 py-3 border border-2 border-black text-base font-medium rounded-md text-black bg-white-600 hover:bg-white-700 md:py-4 md:text-lg md:px-10"
          onClick={() => clickDark("light")}>
          默认主题
        </div>
        <div
          className="grow cursor-pointer flex items-center justify-center px-2 py-3 border border-2 border-black text-base font-medium rounded-md text-black bg-white-600 hover:bg-white-700 md:py-4 md:text-lg md:px-10"
          onClick={() => clickDark("colors")}>
          幻彩
        </div>
        <div
          className="grow cursor-pointer flex items-center justify-center px-2 py-3 border border-transparent text-base font-medium rounded-md text-white bg-dark-600 hover:bg-dark-700 md:py-4 md:text-lg md:px-10"
          onClick={() => clickDark("dark")}>
          黑色主题
        </div>
        <div
          className="grow cursor-pointer flex items-center justify-center px-2 py-3 border border-transparent text-base font-medium rounded-md text-napoli-light bg-klein-600 hover:bg-klein-700 md:py-4 md:text-lg md:px-10"
          onClick={() => clickDark("klein")}>
          克莱因蓝
        </div>
        <div
          className="grow cursor-pointer flex items-center justify-center px-2 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 md:py-4 md:text-lg md:px-10"
          onClick={() => clickDark("pink")}>
          猛男粉
        </div>
        <div className="">{data}</div>
      </div>
    </div>

  )
}

export default IndexPopup
