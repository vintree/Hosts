/**
 *  author puxiao
 *  time 2016-10-06
 *  des 清除系统dns
 *  */ 

// dscacheutil -flushcache 删除

var childProcess = require('child_process')

var sysVersion = {
    arr: ['14D136', '14C109', '14B25', '14A389'],
    command: 'sudo dscacheutil -flushcache sudo discoveryutil mdnsflushcache'
}
var otherCommand = 'sudo dscacheutil -flushcache sudo killall -HUP mDNSResponder'

function cleanSys(command) {
    childProcess.exec(command, function(error, stdout, stderr) {
        if(error !== null) {
            console.error(command, '异常结束')
        }
    })
}

export default function cleanSysDNS(str) {
    childProcess.exec('sw_vers', function(error, stdout, stderr) {
        if(error === null) {
            var plate = stdout.match(/BuildVersion:\s*(.*)/)[1]
            if(sysVersion.arr.indexOf(plate) > -1) {
                cleanSys(sysVersion.command)
                return 
            } else {
                cleanSys(otherCommand)
                return 
            }
        } else {
            console.error('sw_vers', '异常结束')
        }
    })
}