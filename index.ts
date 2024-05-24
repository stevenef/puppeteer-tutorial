const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// const fs = require('fs')
import { Browser } from 'puppeteer'

puppeteer.use(StealthPlugin())
const { executablePath } = require('puppeteer')

const url = 'https://books.toscrape.com'
// const url = 'https://bot.sannysoft.com'

const main = async () => {
	const browser: Browser = await puppeteer.launch({
		headless: true,
		executablePath: executablePath(),
	})
	const page = await browser.newPage()
	await page.goto(url)

	const bookData = await page.evaluate((url) => {
		const bookPods = Array.from(document.querySelectorAll('.product_pod'))
		const data = bookPods.map((book: any) => ({
			title: book.querySelector('h3 a').getAttribute('title'),
			price: book.querySelector('.price_color').innerText,
			imgSrc: url + book.querySelector('img').getAttribute('src'),
			rating: book.querySelector('.star-rating').classList[1],
		}))
		return data
	}, url)
	console.log(bookData)

	await browser.close()

	// fs.writeFile('data.json', JSON.stringify(bookData), (err: any) => {
	// 	if (err) throw err
	// 	console.log('Successfully save JSON!')
	// })
}

main()
