import { readFile } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = parseInt(process.env.PORT ?? "0", 10);

export function createStaticServer(): Server {
	const server = createServer(async (req, res) => {
		try {
			if (req.method !== "GET") {
				res.statusCode = 405;
				res.setHeader("Allow", "GET")
				res.end();
			} else if (req.url === "/") {
				const content = await readFile(join(__dirname, "..", "index.html"));
				res.statusCode = 200;
				res.setHeader("Content-Type", "text/html;charset=UTF-8");
				res.end(content);
			} else {
				res.statusCode = 404;
				res.end();
			}
		} catch (err) {
			console.error(err);
			res.statusCode = 500;
			res.end();
		} finally {
			console.info(`${req.method} ${req.url} - ${res.statusCode}`)
		}
	});
	server.listen(port, () => {
		const bound = server.address();
		if (typeof bound !== "object" || bound === null) {
			throw new Error(`invalid binding ${bound}`);
		}
		console.info(`listening on ${bound.port}`);
	});
	return server;
}
