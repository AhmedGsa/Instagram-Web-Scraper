const puppeteer = require("puppeteer")
const BadRequestError = require("./errors/custom-error")

const scraper = async (req, res) => {
    const { username, email, password } = req.body
    if(!username || !email || !password) {
        throw new BadRequestError("Please provide required information !")
    }
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    await page.goto("https://www.instagram.com/")
    await page.type('input[name="username"]',email)
    await page.type('input[name="password"]',password)
    await page.click('button[type="submit"]')
    await page.waitForNavigation()

    await page.goto(`https://www.instagram.com/${username}/`)
    await page.waitForSelector("._ac2a")
    const info = await page.evaluate(() => {
        const info = document.querySelectorAll("._ac2a")
        const posts = info[0].textContent
        const followers = info[1].textContent
        const following = info[2].textContent
        return { posts, followers, following }
    })
    const numFollowers = parseInt(info.followers) 
    await page.click(`a[href="/${username}/followers/"]`)
    await page.waitForSelector("span ._ab8y")
    let hoverOverThis = `._aano > div > div > div:last-child`
    for(let i=1; i< Math.round(numFollowers/10); i++) {
        await page.waitForSelector(hoverOverThis);
        await page.hover(hoverOverThis)
        await page.waitForTimeout(1500)
    }

    const followers = await page.evaluate(async () => {
        const followers = document.querySelectorAll("span ._ab8y")
        let names = []
        for (let i = 0; i < followers.length; i++) {
            names.push(followers[i].textContent)
        }
        return names
    })
    await browser.close()
    res.status(200).json({info, followers})
}

module.exports = scraper