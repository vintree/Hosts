/**
 *  author puxiao
 *  time 2016-10-05
 *  des 写入hosts文件，/etc/hosts
 */
import fs from 'fs'
import { checkActiveAll } from '../db-model/host'
import formatLabel from './format-label'
import CleanSysDNS from './clean-sys-dns'
export default function updateHostFile() {
    let content = ''
    checkActiveAll().map((v, i) => {
        const name = v.name
        let splitStart = ''
        splitStart = formatLabel(i === 0 ? 'first' : undefined, name)
        content += splitStart + v.content
    })
    CleanSysDNS('cleanSysDNS')
    fs.writeFileSync('/etc/hosts', content, {
        encoding: 'utf8',
        mode: '0o777'
    })
}