import host from './host'
import active from './active'
import plugin from './plugin'
import loading from './loading'
module.exports = {
    ...host,
    ...active,
    ...plugin,
    ...loading
}