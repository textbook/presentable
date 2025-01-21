import axios from "axios";
import express from "express";

const things = [];

function deleteAllThings() {
	things.length = 0;
}

const application = express();
application.use(express.json());

application.get("/things", (_, res) => {
	res.send(things);
});

application.post("/things", (req, res) => {
	things.push(req.body);
	res.sendStatus(201);
});

let app, server;

beforeAll(() => {
	server = application.listen(0);
	app = `http://localhost:${server.address().port}`;
});

afterAll(() => {
	server?.close();
});

//#region snippet
describe("POST /things", () => {
	it("creates a new thing", async () => {
		await deleteAllThings();

		let res = await axios.post(`${app}/things`, { name: "foo" });
		expect(res.status).toBe(201);

		res = await axios.get(`${app}/things`);
		expect(res.status).toBe(200);
		expect(res.data).toHaveLength(1);
		expect(res.data[0]).toHaveProperty("name", "foo");
	});
});
//#endregion
