import { Browser, launch } from "puppeteer";

export async function createBrowser(): Promise<Browser> {
	return await launch({
		defaultViewport: {
			deviceScaleFactor: 4,
			height: 768,
			width: 1_024,
		},
	});
}
