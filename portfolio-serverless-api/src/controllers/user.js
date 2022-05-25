const UserService = require("../services/user");
const { updateUserSchema, getUserSchema } = require("../schemas/user");
const { sendResponse } = require("../../utils/utils");
const middy = require("@middy/core");
const validator = require("@middy/validator");
const httpHeaderNormalizer = require("@middy/http-header-normalizer");
const httpErrorHandler = require("@middy/http-error-handler");
const httpErrorLogger = require("@middy/error-logger");
const httpJsonBodyParser = require("@middy/http-json-body-parser");

const userService = new UserService();

const createUser = middy(async (event) => {
  try {
    const user = JSON.parse(event.body);
    await userService.createUser(user);
    return sendResponse(200, user);
  } catch (error) {
    throw error;
  }
});

const updateUser = middy(async (event) => {
  try {
    const targetParams = event.body;
    const { portfolioId } = event.pathParameters;
    const data = await userService.updateUser(portfolioId, targetParams);
    return sendResponse(200, data);
  } catch (error) {
    throw error;
  }
});

const getAllUsers = middy(async (event) => {
  try {
    const users = await userService.getUsers();
    return sendResponse(200, users.Items);
  } catch (error) {
    throw error;
  }
});

const getUser = middy(async (event) => {
  try {
    const { portfolioId } = event.pathParameters;
    const user = await userService.getUser(portfolioId);

    return sendResponse(200, user);
  } catch (error) {
    throw error;
  }
});

createUser.use([
  httpHeaderNormalizer(),
  httpJsonBodyParser(),
  httpErrorHandler({ logger: false, fallbackMessage: "Unknown Error" }),
  httpErrorLogger(),
]);
getUser.use([
  httpHeaderNormalizer(),
  httpJsonBodyParser(),
  validator({ inputSchema: getUserSchema }),
  httpErrorHandler({ logger: false, fallbackMessage: "Unknown Error" }),
  httpErrorLogger(),
]);
getAllUsers.use([
  httpHeaderNormalizer(),
  httpJsonBodyParser(),
  httpErrorHandler({ logger: false, fallbackMessage: "Unknown Error" }),
  httpErrorLogger(),
]);
updateUser.use([
  httpHeaderNormalizer(),
  httpJsonBodyParser(),
  validator({ inputSchema: updateUserSchema }),
  httpErrorHandler({ logger: false, fallbackMessage: "Unknown Error" }),
  httpErrorLogger(),
]);

module.exports = {
  getUser,
  updateUser,
  createUser,
  getAllUsers,
};
