export const successCode = 0;
// 组件状态
export const EnumScreenStatus = {
    developing: {
        label: '开发中',
        value: 0
    },
    testing: {
        label: '测试中',
        value: 1
    },
    complete: {
        label: '已交付',
        value: 2
    }
};
export const formatDate = (datetime) => {
    var date = new Date(datetime);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var year = date.getFullYear(),
        month = ("0" + (date.getMonth() + 1)).slice(-2),
        sdate = ("0" + date.getDate()).slice(-2),
        hour = ("0" + date.getHours()).slice(-2),
        minute = ("0" + date.getMinutes()).slice(-2),
        second = ("0" + date.getSeconds()).slice(-2);
    // 拼接
    var result = year + "-" + month + "-" + sdate + " " + hour + ":" + minute + ":" + second;
    // 返回
    return result;
};