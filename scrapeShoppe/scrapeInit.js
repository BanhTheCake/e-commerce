const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const UserAgent = require('user-agents')

const startBrowser = () => {
    return new Promise((Rs, rj) => {
      puppeteer.use(StealthPlugin())
        puppeteer.launch({
            headless: false,
            args: ['--disable-setuid-sandbox'],
            'ignoreHTTPSErrors': true,

        }).then(async browser => {
            return Rs(browser)
          }).catch(async e => {
            return rj(e)
          })
    })
}

module.exports = {startBrowser}