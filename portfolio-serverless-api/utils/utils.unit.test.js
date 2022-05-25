const { sendResponse } = require("./utils");

test("Response is an Object", () => {
  const response = sendResponse(200, { name: "bob" });
  expect(typeof response).toBe('object')
});
