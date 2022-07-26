import { useState } from "react"

import { Storage, useStorage } from "@plasmohq/storage"

import "./popup.css"

function IndexPopup() {
  const [data, setData] = useState("")
  const storage = new Storage({ area:"local"})

  async function clickDark(theme) {
    console.log("点击了黑色")
    await storage.set("theme", theme)
    const msg = { theme }
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, msg, function (response) {
        console.log("popup返回--", response)
      })
    })
    setData(theme)
  }
  return (
    <div className="w-80 grid grid-cols-2 gap-4 p-5 ">
      <div
        className="grow cursor-pointer flex items-center justify-center px-2 py-3 border border-2 border-black text-base font-medium rounded-md text-black bg-white-600 hover:bg-white-700 md:py-4 md:text-lg md:px-10"
        onClick={() => clickDark("light")}>
        默认主题
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
      <div className="">{data}</div>
    </div>
  )
}

export default IndexPopup
