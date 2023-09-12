const { startBrowser } = require('./scrapeInit');
const fs = require('fs');
const slugify = require('slugify');
const UserAgent = require("user-agents");

const browserInstance = startBrowser;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function autoScroll(page, maxScrolls) {
    await page.evaluate(async (maxScrolls) => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var scrolls = 0; // scrolls counter
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                scrolls++; // increment counter

                // stop scrolling if reached the end or the maximum number of scrolls
                if (
                    totalHeight >= scrollHeight - window.innerHeight ||
                    scrolls >= maxScrolls
                ) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    }, maxScrolls); // pass maxScrolls to the function
}

const scrapeCategory = async (browser) => {
    if (!browser) return [];
    const url = 'https://shopee.vn/';
    let page = await browser.newPage();
    console.log('[CATEGORY]: INIT');
    console.log('[CATEGORY]: GO TO URL ' + url);
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });

    try {
        await page.waitForSelector('#main shopee-banner-popup-stateful');
        await page.click(
            '>>> div.home-popup__close-area div.shopee-popup__close-btn'
        );
        await page.waitForSelector('.shopee-header-section__content');
        await page.waitForSelector('.carousel-arrow--next');

        const category = await page.evaluate(async () => {
            const list = document.querySelector(
                '.home-category-list .shopee-header-section__content .image-carousel__item-list'
            );
            list.scrollIntoView();
            const els = document.querySelectorAll(
                '.home-category-list .shopee-header-section__content .image-carousel__item-list > li'
            );
            if (!els) return [];
            const btn = document.querySelector(
                '.carousel-arrow.carousel-arrow--next.carousel-arrow--hint'
            );
            btn.click();
            await new Promise((resolve) => setTimeout(resolve, 1000));
            btn.click();
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return Array.from(els).map((el) => {
                return {
                    link: el.querySelector('a').href,
                    name: el.querySelector('a .K34m1x')?.textContent,
                };
            });
        });
        console.log('[SCRAPE]: DONE');
        return category ?? [];
    } catch (error) {
        console.log(error);
    } finally {
        await page.close();
    }
};

const scrapeProductDetails = async (url, browser) => {
    if (!browser) return [];
    let page = await browser.newPage();
    try {
        console.log('[PRODUCT_DETAILS]: INIT');
        console.log('[PRODUCT_DETAILS]: GO TO URL ' + url);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
        await page.waitForTimeout((Math.floor(Math.random() * 12) + 5) * 100) 
        const isLoginPage = await page.$('.Gxi65y')
        if (isLoginPage) return null
        await autoScroll(page, 10);
        await page.waitForSelector('.product-briefing');
        await page.waitForSelector('.f7AU53');
        await delay(1000);
        const productDetails = await page.evaluate(() => {
            const images = (() => {
                const arr = [];
                const elementImg = document.querySelector(
                    'div.XjROLg > .flex-column'
                );
                const bigImg = elementImg.querySelector('div.UJO7PA');
                arr.push({
                    img:
                        bigImg.querySelector('._11mwwv > picture > img')?.src ||
                        '',
                });
                const listImgs = elementImg.querySelectorAll(
                    'div.LmLCVP > .lnM4pa'
                );
                Array.from(listImgs).forEach((el) => {
                    console.log(el);
                    const img =
                        el.querySelector('._11mwwv > picture > img')?.src || '';
                    arr.push({
                        img,
                    });
                    return img;
                });
                return arr.filter((img) => img.img);
            })();
            const attr = (() => {
                const elementAttr = document.querySelector('.RBf1cu');
                const label =
                    elementAttr.querySelector('._44qnta > span')?.textContent ||
                    '';
                const star =
                    elementAttr.querySelector('._1k47d8._046PXf')?.textContent;
                const price =
                    elementAttr.querySelector('.nmrSND .pqTWkA')?.textContent ||
                    '0';
                const quantity =
                    elementAttr.querySelector(
                        '._6lioXX > div:last-child > div:last-child'
                    )?.textContent || '0';
                const description =
                    document.querySelector('.f7AU53')?.innerText || '';
                return {
                    label,
                    star,
                    price,
                    quantity,
                    description,
                };
            })();
            console.log({
                images,
                attr,
            });
            return {
                images,
                attr,
            };
        });
        console.log('[SCRAPE_DETAILS]: DONE');
        return productDetails;
    } catch (error) {
        console.log(error);
    } finally {
        await page.close();
    }
};

const scrapeProduct = async (url, browser) => {
    if (!browser) return [];
    let page = await browser.newPage();
    console.log('[PRODUCT]: INIT');
    console.log('[PRODUCT]: GO TO URL ' + url);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 90000 });
    try {
        await page.waitForSelector('.shopee-search-item-result__items');
        const products = await page.$$eval(
            '.shopee-search-item-result__item',
            (els) => {
                return els.slice(0, 10).map((el) => {
                    el.querySelector('a').click();
                    return {
                        link: el.querySelector('a').href,
                        name: el.querySelector('a div._2KkMCe')?.textContent,
                    };
                });
            }
        );
        console.log('[SCRAPE_PRODUCTS]: DONE');
        return products;
    } catch (error) {
        console.log('[PRODUCT]: ', error);
    } finally {
        await page.close();
    }
};

const init = async () => {
    const browser = await browserInstance();
    console.log(browser);
    let categories = await scrapeCategory(browser);
    categories = categories.slice(0, 10);
    let id = 1;
    for (const category of categories) {
        const products = await scrapeProduct(category.link, browser);
        const categoryItem = [];
        for (const product of products) {
            await delay(500);
            try {
                console.log(`[PRODUCT ${id}]`);
                const productDetails = await scrapeProductDetails(
                    product.link,
                    browser
                );
                if (productDetails) {
                    categoryItem.push({
                        ...productDetails,
                        category: category.name,
                        id: id++,
                    });
                }
            } catch (error) {
                console.log('[ERROR]: ', error);
            }
        }
        fs.writeFileSync(
            `${__dirname}/data/${slugify(category.name)}.json`,
            JSON.stringify(categoryItem),
            { flag: 'w' },
            (err) => {
                if (err) {
                    console.log('[FILE]: ', err);
                }
            }
        );
    }
    console.log('[INIT]: DONE');
    await browser.close();
};

init();
