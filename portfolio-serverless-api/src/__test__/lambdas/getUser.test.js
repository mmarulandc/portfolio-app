const { getUser } = require("../../controllers/user");
const { mockedUserResponse, mockedUser } = require("../mocks/mockedData/user");
const eventGenerator = require("../testUtils/eventGenerator");
const validator = require("../testUtils/validators");
const AWS = require("aws-sdk");
const { mockGetDynamo } = require("../mocks/functions/dynamo_db");
describe("When we invoke getUser", () => {
  describe("Successful case", () => {
    let response;
    beforeAll(async () => {
      jest.mock("aws-sdk");
      const mockedGet = mockGetDynamo(
        AWS.DynamoDB.DocumentClient,
        false,
        mockedUser
      );

      const event = eventGenerator({
        pathParametersObject: {
          portfolioId: "dfddb1fe-228f-41fb-a419-3b3a87960188",
        },
      });
      response = await getUser(event);
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    test("It should take a body and return an API Gateway response", async () => {
      expect(response).toBeDefined();
      expect(validator.isApiGatewayResponse(response)).toBe(true);
    });

    test("It should return status code 200 and the user", () => {
      const { statusCode, body } = response;
      expect(statusCode).toBeDefined();
      expect(statusCode).toEqual(200);
      expect(body).toBeDefined();
      expect(JSON.parse(body)).toEqual(mockedUserResponse);
    });
  });
  describe("Failed cases", () => {
    describe("User not found", () => {
      beforeAll(async () => {
        jest.mock("aws-sdk");
        const mockedGet = mockGetDynamo(AWS.DynamoDB.DocumentClient, false, {});

        const event = eventGenerator({
          pathParametersObject: {
            portfolioId: "d",
          },
        });

        response = await getUser(event);
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      test("It should take a body and return an API Gateway response", async () => {
        expect(response).toBeDefined();
        expect(validator.isApiGatewayResponse(response)).toBe(true);
      });

      test("It should return statusCode 404", async () => {
        const { statusCode, body } = response;
        expect(statusCode).toBeDefined();
        expect(statusCode).toEqual(404);
        expect(body).toBeDefined();
        expect(body).toEqual("Not Found");
      });
    });

    describe("Database should fail", () => {
      beforeAll(async () => {
        jest.mock("aws-sdk");
        const mockedGet = mockGetDynamo(AWS.DynamoDB.DocumentClient, true, {});

        const event = eventGenerator({
          pathParametersObject: {
            portfolioId: "d",
          },
        });
        response = await getUser(event);
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      test("It should take a body and return an API Gateway response", async () => {
        expect(response).toBeDefined();
        expect(validator.isApiGatewayResponse(response)).toBe(true);
      });
      test("It should return statusCode 500", async () => {
        const { statusCode, body } = response;
        expect(statusCode).toBeDefined();
        expect(statusCode).toEqual(500);
        expect(body).toBeDefined();
        expect(body).toEqual("Unknown Error");
      });
    });
  });
});
