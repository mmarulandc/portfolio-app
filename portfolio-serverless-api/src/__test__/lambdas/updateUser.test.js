const { updateUser } = require("../../controllers/user");
const { mockedUserResponse, mockedUser } = require("../mocks/mockedData/user");
const eventGenerator = require("../testUtils/eventGenerator");
const validator = require("../testUtils/validators");
const AWS = require("aws-sdk");
const {
  mockGetDynamo,
  mockUpdateDynamo,
} = require("../mocks/functions/dynamo_db");
describe("When we invoke updateUser", () => {
  describe("Successful cases", () => {
    describe("With many changed properties", () => {
      let response;
      const requestBody = {
        imageUrl: "http://myimage.url.com",
        description: "this is for testing",
        title: "test",
        twitterUserName: "test",
      };
      beforeAll(async () => {
        jest.mock("aws-sdk");
        const mockedGet = mockGetDynamo(
          AWS.DynamoDB.DocumentClient,
          false,
          mockedUser
        );

        const mockedUpdate = mockUpdateDynamo(
          AWS.DynamoDB.DocumentClient,
          false,
          {
            Attributes: {
              imageUrl: "http://myimage.url.com",
              description: "this is for testing",
              title: "test",
              twitterUserName: "test",
            },
          }
        );

        const event = eventGenerator({
          pathParametersObject: {
            portfolioId: "dfddb1fe-228f-41fb-a419-3b3a87960188",
          },
          body: requestBody,
        });
        response = await updateUser(event);
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      test("It should take a body and return an API Gateway response", async () => {
        expect(response).toBeDefined();
        expect(validator.isApiGatewayResponse(response)).toBe(true);
      });

      test("It should return status code 200 and the user updated", () => {
        const { statusCode, body } = response;
        expect(statusCode).toBeDefined();
        expect(statusCode).toEqual(200);
        expect(body).toBeDefined();
        expect(JSON.parse(body)).toEqual(requestBody);
      });
    });
    describe("With only one changed property", () => {
      let response;
      const requestBody = {
        imageUrl: "http://myimages.url.com",
      };
      beforeAll(async () => {
        jest.mock("aws-sdk");
        const mockedGet = mockGetDynamo(
          AWS.DynamoDB.DocumentClient,
          false,
          mockedUser
        );

        const mockedUpdate = mockUpdateDynamo(
          AWS.DynamoDB.DocumentClient,
          false,
          {
            Attributes: {
              portfolioId: "dfddb1fe-228f-41fb-a419-3b3a87960188",
              imageUrl: "http://myimages.url.com",
              description: "Editing 6055",
              twitterUserName: "LordSnows",
              title: "Dummy For Testings",
            },
          }
        );

        const event = eventGenerator({
          pathParametersObject: {
            portfolioId: "dfddb1fe-228f-41fb-a419-3b3a87960188",
          },
          body: requestBody,
        });
        response = await updateUser(event);
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      test("It should return status code 200 and the user image updated", () => {
        const { statusCode, body } = response;
        const responseBody = JSON.parse(body);
        expect(statusCode).toBeDefined();
        expect(statusCode).toEqual(200);
        expect(body).toBeDefined();
        expect(responseBody).not.toEqual(mockedUserResponse);
        expect(responseBody.imageUrl).not.toEqual(mockedUserResponse.imageUrl);
        expect(responseBody.imageUrl).toEqual("http://myimages.url.com");
      });
    });
  });
  describe("Failed cases", () => {
    describe("User not found", () => {
      beforeAll(async () => {
        const requestBody = {
          imageUrl: "http://myimages.url.com",
        };
        jest.mock("aws-sdk");
        const mockedGet = mockGetDynamo(AWS.DynamoDB.DocumentClient, false, {});

        const event = eventGenerator({
          pathParametersObject: {
            portfolioId: "d",
          },
          body: requestBody,
        });

        response = await updateUser(event);
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
        const requestBody = {
          imageUrl: "http://myimages.url.com",
        };
        const mockedGet = mockUpdateDynamo(
          AWS.DynamoDB.DocumentClient,
          true,
          {}
        );

        const event = eventGenerator({
          pathParametersObject: {
            portfolioId: "d",
          },
          body: requestBody,
        });
        response = await updateUser(event);
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
    describe("Bad params", () => {
      beforeAll(async () => {
        jest.mock("aws-sdk");
        const requestBody = {
          imageUrls: "http://myimages.url.com", //invalid param
        };

        const event = eventGenerator({
          pathParametersObject: {
            portfolioId: "d",
          },
          body: requestBody,
        });
        response = await updateUser(event);
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      test("It should take a body and return an API Gateway response", async () => {
        expect(response).toBeDefined();
        expect(validator.isApiGatewayResponse(response)).toBe(true);
      });

      test("It should return statusCode 400", async () => {
        const { statusCode, body } = response;
        expect(statusCode).toBeDefined();
        expect(statusCode).toEqual(400);
        expect(body).toBeDefined();
        expect(body).toEqual("Event object failed validation");
      });
    });
  });
});
