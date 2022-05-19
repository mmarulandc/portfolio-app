const { v4 } = require("uuid");
const AWS = require("aws-sdk");
const { generateUpdateQuery } = require("../../utils/utils");
const createError = require("http-errors");

class UserService {
  dynamodb;
  tableName = "PortfolioTable";
  constructor() {
    this.dynamodb = new AWS.DynamoDB.DocumentClient();
  }

  createUser = async (user) => {
    const { description, imageUrl, twitterUserName, title } = user;
    const idPortfolio = v4();
    const newUser = {
      portfolioId: idPortfolio,
      description,
      imageUrl,
      twitterUserName,
      title,
    };
    try {
      await this.dynamodb
        .put({
          TableName: this.tableName,
          Item: newUser,
        })
        .promise();
    } catch (error) {
      throw new createError.InternalServerError(
        "Error while adding new user portfolio"
      );
    }
  };

  getUsers = async () => {
    try {
      const users = await this.dynamodb
        .scan({
          TableName: this.tableName,
        })
        .promise();
      if (users.Count <= 0) {
        throw new createError.NotFound("Users portfolios not found");
      }
      return users;
    } catch (error) {
      if(error.statusCode === 404) {
        throw error;
      }
      throw new createError.InternalServerError(
        "Error while retrieving users portfolios data"
      );
    }
  };

  getUser = async (portfolioId) => {
    try {
      const user = await this.dynamodb
        .get({
          TableName: this.tableName,
          Key: { portfolioId: portfolioId },
        })
        .promise();
      if (!user.Item) {
        throw new createError.NotFound();
      }

      return user;
    } catch (error) {
      if (error.statusCode === 404) {
        throw error;
      }
      throw new createError.InternalServerError(
        "Error has ocurred while fetching the user"
      );
    }
  };

  updateUser = async (portfolioId, targetProps) => {
    try {
      const expression = generateUpdateQuery(targetProps);
      console.log(portfolioId);
      await this.getUser(portfolioId)
      const data = await this.dynamodb
        .update({
          TableName: this.tableName,
          Key: { portfolioId },
          ...expression,
          ReturnValues: "ALL_NEW",
        })
        .promise();
      return data;
    } catch (error) {
      if (error.statusCode === 404) {
        throw error;
      }
      throw new createError.InternalServerError(
        "Error while updating portfolio"
      );
    }
  };
}

module.exports = UserService;
