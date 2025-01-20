describe("POST /things", () => {
	it("creates a new thing", async () => {
		await deleteAllThings();

		let res = await axios
			.post(`${app}/things`, { name: "foo" });
		expect(res.status).toBe(201);

		res = await axios.get(`${app}/things`);
		expect(res.status).toBe(200);
		expect(res.data).toHaveLength(1);
		expect(res.data[0])
			.toHaveProperty("name", "foo");
	});
});
