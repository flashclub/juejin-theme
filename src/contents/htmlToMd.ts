class ChangeToMd {
  data = {
    H1: "#",
    H2: "##",
    H3: "###",
    H4: "####",
    H5: "#####",
    H6: "######",
    P: "",
    BR: "&#10;",
    STRONG: "**${$1}**", //粗体
    EM: "*${$1}*", //斜体
    SPAN: "",
    "#text": "",
    HR: "---", //分割线
    STYLE: "",
    UL: "- ${1}",
    OL: "1. ${1}",
    LI: "",
    PRE: "",  //  代码块
    CODE: "```${1}```", //  代码
    A: "[${1}](${2})",
    IMG: "![$1]($2)",  //图片
    BLOCKQUOTE: "> {$1}", //引用 >
    DEL: "~~{$1}~~"
  }
  nowTagList = {}
  nowTagElement = []
  constructor() {
    this.init()
  }
  init() {
    console.log(" change to md 初始化OK")
    const element = document.querySelector(
      "article .article-content .markdown-body"
    ).childNodes
    this.nowTagElement = this.getElement(element)
    console.log("--this element", element)
    console.log("--this res", this.nowTagElement)
    console.log("--this nowTagList", JSON.stringify(this.nowTagList))
  }
  getElement(element, result?) {
    !result && (result = [])
    const elements = [...element]
    elements.forEach((element: any) => {
      const { nodeName, innerText, nodeValue, childNodes } = element
      console.log('childNodes 内容--' ,childNodes.length, nodeName);
      
      if (childNodes.length) {
        this.nowTagList[nodeName] = ""
        if (childNodes.length === 1 && (childNodes[0].nodeName === '#text')) {
          console.log('子内容 text value', childNodes[0].innerText, childNodes[0].nodeValue);

          result.push({
            [nodeName]: childNodes[0].nodeValue
          })
        } else {
          result.push({
            [nodeName]: this.getElement(childNodes)
          })
        }
      } else {
        console.log('text value no nodeName', nodeValue);
        this.nowTagList[nodeName] = ""
        result.push({
          [nodeName]: innerText || nodeValue
        })
        
      }
    })
    return result
  }
  htmlToMd() {
    let data = ''
    for (const item of this.nowTagElement) {
      const key = Object.keys(item)[0]
      const value = Object.values(item)[0]
      if (key !== 'STYLE') {
        if (this.data[key]) {
          if (!this.data[key].includes('$')) { 
            data = data + this.data[key] + value
          }
        }
        
      }
    }
  }
  elementFunction(nodeName, innetText) {
    return ""
  }
}

export default ChangeToMd
