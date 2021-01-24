/*
parsers: # array
  - url: https://xxx.yaml
    file: 'C:\Users\xxx\.config\clash\profiles\myparser.js'
    */

// Clash for Windows parser
module.exports.parse = async (raw, { axios, yaml, notify, console }, { name, url, interval, selected }) => {
    const obj = yaml.parse(raw);
    const orig = ['香港','台湾','日本','韩国', //0~3
                  '新加坡','美国','加拿大','德国', //4~7
                  '英国','澳洲','俄罗斯','长日', //8~11
                  '荷兰','澳大利亚','泰国','广新','印度'];
    const goal = ['🇭🇰 香港','🇹🇼 台湾','🇯🇵 日本','🇰🇷 韩国',
                  '🇸🇬 新加坡','🇺🇸 美国','🇨🇦 加拿大','🇩🇪 德国',
                  '🇬🇧 英国','🇦🇺 澳洲','🇷🇺 俄罗斯','🎌 长日',
                  '🇳🇱 荷兰','🇦🇺 澳大利亚','🇹🇭 泰国','🇸🇬 广新','🇮🇳 印度'];
    // 很奇怪，让goal循环放外层才能正确匹配完整
    for (let j = 0; j < goal.length; j++) {
        for (let i = 0; i < obj.proxies.length; i++) {
            let proxyName = obj.proxies[i].name;
            if (proxyName.search(orig[j] >= 0)) {
                let temp_str = proxyName.replace(orig[j], goal[j]);
                obj.proxies[i].name = temp_str;
                obj['proxy-groups'][0].proxies[i] = temp_str;
            }
        }
    }

    return yaml.stringify(obj)
  }
