/*
parsers: # array
  - url: https://xxx.yaml
    file: 'C:\Users\xxx\.config\clash\profiles\myparser.js'
    */

// Clash for Windows parser
const fs = require('fs'); //支持用npm的包
module.exports.parse = async (raw, { axios, yaml, notify, console, homeDir }, { name, url, interval, selected }) => {
  let sortBar = ['🇹🇼', '🇯🇵', '🇸🇬', '🇲🇾', '🇺🇸']; //设置节点排序方式:索引越小权重越高，空数组时不排序
  let obj = yaml.parse(raw);
  // console.log(homeDir)
  axios.get(homeDir + '\\profiles\\emoji0.json') //使用axios 网络请求框架请求本地文件(遗憾：异步不能处理return yaml.stringify(obj);)
    .then(function (response) {
      // console.log(response.data);
      const emojiObj = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
  let fileData = fs.readFileSync(homeDir + '\\profiles\\emoji0.json');
  const emojiObj = JSON.parse(fileData.toString());
  handleProcess(emojiObj);
  function handleProcess(emojiObj) {
    obj.proxies.map((prx_item, prx_index, prx_arry) => {
      let statusBool
      for (let emojkey in emojiObj) {
        statusBool = emojiObj[emojkey].some(function (item, index, arry) {
          return prx_item.name.includes(item)
        })
        if (statusBool) {
          prx_item.name = emojkey + ' ' + prx_item.name;
          break;
        }
      }
      !statusBool ? prx_item.name = '🏴‍☠️' + ' ' + prx_item.name : {}
    })
    obj.proxies.sort(sortNodes(sortBar));
    obj.proxies.forEach(function (item, index, arry) {
      obj['proxy-groups'][0].proxies[index] = item.name;
    })

    function sortNodes(sN_arry) {
      return (a, b) => {
        let a_temp = 0, b_temp = 0;
        if (sN_arry.length > 0) {
          sN_arry.forEach(function (item, index, arry) {
            a.name.includes(item) ? a_temp = sN_arry.length - index : {}
            b.name.includes(item) ? b_temp = sN_arry.length - index : {}
          })
          return b_temp - a_temp
        }
        return 0
      }

    }
  }

  return yaml.stringify(obj);

}
