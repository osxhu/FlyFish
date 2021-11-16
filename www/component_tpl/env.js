'use strict';

module.exports = (component_mark, component_replace_mark, version) => `
/**
 * @description 大屏配置
 */
 'use strict';

window.DATAVI_ENV = (function() {
    function formatEditorThumbSrc(imgName){
        return 'application_tpl/asserts/img/components/' + imgName;
    }

    return {
        debug: true,
        apiDomain: 'http://127.0.0.1:9090',
        componentsDir: 'components/${component_mark}/${version}/components',

        // 大屏编辑器组件菜单枚举
        componentsMenuForEditor: [
            {
                name: '组件',
                icon: 'changyongzujian',
                components: [
                    {
                        type: '${component_replace_mark}',
                        name: '组件开发',
                        author: 'Cloudwise',
                        description: '',
                        thumb: formatEditorThumbSrc('system-hchart-line.png')
                    }
                ]
            }
        ]

    }
})();
`;
