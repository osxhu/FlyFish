/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-12-07 14:08:25
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-12-07 15:31:39
 */
window.LCAP_CONFIG = (function () {
  return {
    basename: "lcap", // 路由统一前缀，注册为微服务后必须有唯一值
    IP: "", // 后端服务IP地址
    screenEditAddress: "http://10.0.14.151:7001/web/screen/editor.html",
    screenViewAddress: "http://10.0.14.151:7001/web/screen/index.html",
    vscodeAddress: `http://${window.location.hostname}:8081`,
  };
})();
