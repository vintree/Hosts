/**
 *  author: puxiao
 *  time: 2016-10-05
 *  des: 自动补零
 */
// num 数字，n 需要的位数
module.exports = function prefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}