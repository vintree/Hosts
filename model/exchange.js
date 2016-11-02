/**
 *  author: puxiao
 *  time: 2016-10-16
 *  des: 交换前移
 *  */ 
module.exports = function exchange(ix, currentIx, arr) {
    let tempPlugin = arr[ix]
    let i = ix
    if(ix < currentIx) {
        for(let l = currentIx; i < l; i++) {
            arr[i] = arr[i + 1]
        }
    } else {
        for(let l = currentIx; i > l; i--) {
            arr[i] = arr[i - 1]
        }
    }
    arr[i] = tempPlugin
    return arr 
}