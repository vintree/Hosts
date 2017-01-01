/**
 *  author puxiao
 *  time 2017-01-01
 *  des 初始化hosts数据
 */ 
import Hosts from '../../db-model/host'

module.exports = () => {
    const hosts = Hosts.checkAll()
    const defaults = Hosts.defaults
    const { color } = defaults
    let tempHosts = []
    function setColor() {
        tempHosts = hosts.map((host) => {
            if(!host.color) {
                host.color = color
            }
        })
        Hosts.createHost(tempHosts)
    }
    hosts && setColor()
}