/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2021-06-04 10:27:43
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-07-27 11:39:20
 */
'use strict';
module.exports = componentId => `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>Data-VI 数据可视化</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="/common/editor.css" />
</head>
<body>
<div id="container"></div>
<script type="text/javascript" src="/components/${componentId}/current/env.js"></script>
<script type="text/javascript" src="/common/data-vi.js"></script>
<script type="text/javascript" src="/common/editor.js"></script>
<script type="text/javascript">
    window.onload = function () {

        require(['json!./options.json','data-vi/helpers', 'data-vi/start'], function (settings, _, start) {
            start.initializeBySetting(settings);
        });
    };
</script>
</body>
</html>
`;
