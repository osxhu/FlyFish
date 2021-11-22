/**
 * @description 大屏配置
 */

window.DATAVI_ENV = (function () {
    const apiDomain = "http://10.2.3.56:7001";

    return {
        debug: true,
        apiDomain,
        componentsDir: `/components`,
        apiSuccessCode: 0, 

        screenAPI: {
            // 大屏展示和编辑用到的API
            getScreenData: "/applications", // 获取大屏数据
            saveScreenConf: "/applications/{id}/design", // 保存大屏配置
            uploadScreenImg: "/web/visualScreen/screenEditor/uploadScreenImg", // 上传大屏所需图片
            deleteUploadScreenImg:
                "/web/visualScreen/screenEditor/deleteUploadScreenImg", // 删除上传的大屏所需图片
            getModelList: "/web/visualScreen/screenEditor/getModelList", // 获取模型列表
            getModelData: "/web/visualScreen/screenEditor/getModelData", // 获取模型数据
            getScreenComponentList: "/applications/components/list",
        },
    };
}());

