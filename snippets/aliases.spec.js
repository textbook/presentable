import { jest } from "@jest/globals";

const func = cb => cb("Hi!");

//#region snippet
// same test, different style

it("calls the callback", () => {
	const callback = jest.fn();
	func(callback);
	expect(callback)
		.toHaveBeenCalledWith("Hi!");
});

test("callback gets called", () => {
	const callback = jest.fn();
	func(callback);
	expect(callback).toBeCalledWith("Hi!");
});
//#endregion
