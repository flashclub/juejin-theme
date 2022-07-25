import { useState } from "react"
import "./popup.css"
function IndexPopup() {
  const [data, setData] = useState("")
  function clickDark(theme){
    console.log('点击了黑色');
    setData(theme)
  }
  return (
    <div className="w-80 flex p-10 grid-rows-2 grid-cols-2 gap-1">
        <div className="basis-1/2 cursor-pointer flex items-center justify-center px-2 py-3 border border-transparent text-base font-medium rounded-md text-black bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10" onClick={()=>clickDark('dark')}>黑色主题</div>
        <div className="basis-1/2 cursor-pointer flex items-center justify-center px-2 py-3 border border-transparent text-base font-medium rounded-md text-white bg-regal-dark-600 hover:bg-regal-dark-700 md:py-4 md:text-lg md:px-10" onClick={()=>clickDark('dark')}>黑色主题</div>
        <div className="basis-1/2 cursor-pointer flex items-center justify-center px-2 py-3 border border-transparent text-base font-medium rounded-md text-white bg-dark-600 hover:bg-dark-700 md:py-4 md:text-lg md:px-10" onClick={()=>clickDark('origin')}>橙色主题</div>
        <div>{data}</div>
    </div>
  )
}

export default IndexPopup
