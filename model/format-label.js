/**
 *  author puxiao
 *  time 2016-10-05
 *  des 查看全部hosts时，使用分割操作
 */
export default function formatHost(serial, name) {
    if(serial === 'first') {
        return `# ${name}=================\n\n`
    } else {
        return `\n\n# ${name}=================\n\n`
    }
}