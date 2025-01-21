import { Browser, launch } from "puppeteer";

export async function createBrowser(): Promise<Browser> {
	return await launch({
		args: [
			"--disable-setuid-sandbox",
			"--no-sandbox",
		],
		defaultViewport: {
			deviceScaleFactor: 4,
			height: 768,
			width: 1_024,
		},
		headless: true,
	});
}
