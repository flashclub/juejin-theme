class ChangeToMd {
  data = {
    DIV:'\n',
    H1: "\n# ",
    H2: "\n## ",
    H3: "\n### ",
    H4: "\n#### ",
    H5: "\n##### ",
    H6: "\n###### ",
    P: "\n",
    BR: "&#10;",
    STRONG: "**$1**", //粗体
    EM: "*$1*", //斜体
    SPAN: "",
    "#text": "",
    HR: "---", //分割线
    STYLE: "",
    UL: "$1",
    OL: "$1",
    LI: "- ",
    PRE: "\n", //  代码块
    CODE: "`$1`", //  代码
    CODE_BLOCK: "```$1\n```", //  代码块
    A: "[$1]($2)",
    IMG: "![$1]($2)", //图片
    BLOCKQUOTE: "\n> $1", //引用 >
    DEL: "~~$1~~"
  }
  nowTagList = {}
  nowTagElement = []
  constructor(select = "article .article-content .markdown-body" ) {
    this.init(select)
  }
  init(select) {
    console.log(" change to md 初始化OK")
    const element = document.querySelector(select).childNodes
    this.nowTagElement = this.getElement(element)
    console.log("--this element", element)
    console.log("--this res", this.nowTagElement)
    console.log("--this nowTagList", JSON.stringify(this.nowTagList))
    const res = this.htmlToMd(this.nowTagElement)
    console.log('res结果', res);
    
  }
  getElement(element, result?) {
    !result && (result = [])
    const elements = [...element]

    for (const element of elements) {
      const { innerText, nodeValue, childNodes } = element
      let { nodeName } = element
      // console.log('childNodes 内容--' ,childNodes.length, nodeName);
      if (nodeName === 'CODE') {
        console.log('nodeName key: ', nodeName);
        console.dir(element)
        console.log('element classname', element.className);
        if (element.className) {
          nodeName = 'CODE_BLOCK'
        }
      }
      if (nodeName === 'A') {
        console.dir(element)
        console.log('text value no childNodes','nodeName: ',nodeName, nodeValue);
        console.log('链接：',element.href, '文字: ', innerText);
        result.push({
          [nodeName]: {link: element.href, text: innerText }
        })
        continue
      }
      if (nodeName === 'IMG') {
        console.log('链接：',element.currentSrc, 'alt: ', element.alt);
        result.push({
          [nodeName]: {link: element.currentSrc, text: element.alt }
        })
        continue
      } 
      if (childNodes.length) {
        this.nowTagList[nodeName] = ""
        if (childNodes.length === 1 && (childNodes[0].nodeName === '#text')) {
          // console.log('子内容 text value', childNodes[0].innerText, childNodes[0].nodeValue);

          result.push({
            [nodeName]: childNodes[0].nodeValue
          })
        } else {
          result.push({
            [nodeName]: [{[nodeName]: ''}, ...this.getElement(childNodes)]
          })
        }
      } else {
        this.nowTagList[nodeName] = ""
        result.push({
          [nodeName]: innerText || nodeValue
        })
        
      }
    }
    return result
  }
  htmlToMd(nowTagElement = [], data = '', type='') {
    for (const item of nowTagElement) {
      const key = Object.keys(item)[0]
      const value:any = Object.values(item)[0]      
      const joinText = this.data[key] || ''
      
      if (key !== 'STYLE') {
        if (!joinText.includes('$')) {
          if (Array.isArray(value) ) {
            data = this.htmlToMd(value, data, type)
          } else {
            if (type === 'LI') {
              console.log('判断type为 LI 1', key, value+'' );
              if (key === 'LI') {
                data = data + '\n\n- '
              }
              if (!!value.trim()) { 
                console.log('添加 \n', value, !!value, !!value.trim());
                data = data + joinText + value
              }
            } else {
              data = data + joinText + value
            }
          }
        } else {
          if (Array.isArray(value) ) {
            if (key === 'CODE_BLOCK') {
              const code = this.splitCodeBlock(value)
              console.log('拼接code', code);
              data = data + '```\n'+code+'\n```'
            } else if(key === 'UL'){
              const code = this.splitLiEBlock(value)
              console.log('拼接code 2', code);
              data = data + code;
            } else if(key === 'BLOCKQUOTE'){
              const code = this.splitBLOCKQUOTEBlock(value)
              console.log('拼接code 3', code);
              data = data + code + '\n';
            } else {
              data = this.htmlToMd(value, data, type)
            }
          } else {
            if (key === 'IMG' || key === 'A') {
              console.log('替换a标签或图片', value);
              
              const replaceValue = joinText.replace(/(\$\d*)\]\((\$\d*)/, `${value.text}](${value.link}`) 
              data = data + replaceValue
            } else {
              
              const replaceValue = joinText.replace(/(\$\d*)/, value) 
              console.log('【replaceValue】', replaceValue, key);
              data = data + replaceValue
            }
          }
        }
        
      }
    }
    return data
  }
  splitLiEBlock(nowTagElement, data = ''){
    for (const item of nowTagElement) {
      const key = Object.keys(item)[0]
      const value:any = Object.values(item)[0]      
      const joinText = this.data[key] || ''
      
      if (Array.isArray(value)) {
        data = this.htmlToMd(value, data, 'LI')
      } else {
        if (!!value.trim()) {
          console.log('判断key', key, value);
          
          if (key === 'LI') {
            data = data + '\n- ' + value
          } else {
            data = data + value
          }
        }
      }
      console.log('遍历 li', data, key, value);
      
    }
    return data
  }
  splitBLOCKQUOTEBlock(nowTagElement, data = ''){
    for (const item of nowTagElement) {
      const key = Object.keys(item)[0]
      const value:any = Object.values(item)[0]      
      const joinText = this.data[key] || ''
      if (Array.isArray(value)) {
        data = this.splitBLOCKQUOTEBlock(value, data)
      } else {
        if (value && value !== '\n') {
          data = data + '\n> ' + value
        } else {
          data = data + value
        }
      }
    }
    return data
  }
  splitCodeBlock(nowTagElement, data = ''){
    for (const item of nowTagElement) {
      const key = Object.keys(item)[0]
      const value:any = Object.values(item)[0]      
      const joinText = this.data[key] || ''
      if (Array.isArray(value)) {
        data = this.splitCodeBlock(value, data)
      } else {
        data = data + value
      }
    }
    return data
  }
  replacer(match, p1, p2){
    return [p1, p2].join(" - ");
  }
  elementFunction(nodeName, innetText) {
    return ""
  }
}

export default ChangeToMd
