
# Portfolio app using serverless framework

  

This is API based on serverless architecture using the Serveless Framework with node.js template.

  



## The Technologies used for building the app were:
  * Serverless framework
  * Node.js
  * Express
  * NPM
  * AWS DynamoDB
  * Jest (for testing)
  * Middy (npm library which implements the middleware pattern, similar to express)

## Steps to build the app:
1. First I had to research about the serverless architecture, since I did not have any sense about how to code the technology itself. I have heard about it a couple times and I knew some people who develop lambda functions. Therefore it took me a time to have an enpoint finished.

2. Well, after seing how easy is to set the server configuration thanks to **serverless.yml** where one can define the enpoints, the controllers where those endpoints are pointing at and the database schema, I can easly start to code.

3. I am got used to use service classes for the database processes, since I do not want to mix the logic among the controllers and database calls, so if I have to change something related to the database I have the class trying to not break the single-responsability principle. (In this case I only have one service  class called **user**).

4. I needed to debug the application locally because deploying each time testing was required was not totally worth it. So after a lot of research I finally got debug the app using **npx serverless offline**  and much googleling.

5. In terms of backend development I feel comfortable using express I find the middleware pattern straighforward to follow and it was a surprise when I found a library called **middy**  which allows me to do the same with the **Serverless framework**.  Finally I got the chance for checking the input values sent in the **serverless event** before it reaches the endpoints controllers. Also I found some  **middlewares** as **http-json-body-parser**, **http-error-handler**, **error-logger** which made my life easier. 

6. At the end I did not follow **TDD** but I made some simple tests for testing the lambdas, (don't judge me, they are really simple test). I mocked the database calls because on an Integration test it was not possible to pass the DynamoDB configuration (at least I don't know how) and I was just checking statusCodes and response bodie's.

7. `serverless deploy --verbose` would deploy the app into **API-GATEWAY**  in AWS and now is ready to consume

8. I have used **express generator** to build the front-end of the application, I was planning to use **React.js** but since the Twitter API has a CORS error consuming it from a client I decided to use **Express** for this task. The credentials for Twitter API v1.1 were given and used  for retrieving tweets from the timeline of any user and then integrate them in the front-end part of the application.

And that was a brief explanation about how I built the application, I did not get to make it run locally on another pc besides mine, but the application is currently deployed.

## Running test cases


1. Open a new terminal tab and clone the repo

```

$ git clone git@github.com:mmarulandc/portfolio-app.git

```

2. Change the directory to **portfolio-serverless-api** and run **npm install**

```

$ cd portfolio-app/portfolio-serverless-api/ && npm install

```
  3.  Finally run **npm run test** for running the test cases

```

$ npm run test

```
  
## Available Endpoints

* GET **{PORTFOLIO_URL}/user** will respond with the storaged users portfolios in an array format:
```json
[{"portfolioId": "44c8c966-89f6-4bef-9552-d231e35fc83b","imageUrl": "[https://pbs.twimg.com/profile_images/901947348699545601/hqRMHITj_400x400.jpg](https://pbs.twimg.com/profile_images/901947348699545601/hqRMHITj_400x400.jpg)","description": "Lord Commander of the Night's Watch and King of the Free Folk. Not affiliated with HBO. (Parody Account)","twitterUserName": "LordSnow","title": "Jon Snow"},{"portfolioId": "1","imageUrl": "[https://pbs.twimg.com/profile_images/1521544530230595584/my_Sigxw_400x400.jpg](https://pbs.twimg.com/profile_images/1521544530230595584/my_Sigxw_400x400.jpg)","description": "Editing 605","twitterUserName": "LordSnow","title": "Dummy For Testing"}]

```

* GET **{PORTFOLIO_URL}/user/:portfolioId** will respond with the storaged user portfolio. the **portfolioId** is required

```json

{
	"portfolioId": "44c8c966-89f6-4bef-9552-d231e35fc83b",
	"imageUrl": "[https://pbs.twimg.com/profile_images/901947348699545601/hqRMHITj_400x400.jpg](https://pbs.twimg.com/profile_images/901947348699545601/hqRMHITj_400x400.jpg)",
	"description": "Lord Commander of the Night's Watch and King of the Free Folk. Not affiliated with HBO. (Parody Account)",
	"twitterUserName": "LordSnow",
	"title": "Jon Snow"
}

```

* PUT **{PORTFOLIO_URL}/user/:portfolioId** will allow you to update a user portfolio given an **portfolioId** .
* At least one of the followed fields must be included in the body request:  
`
```json

{
	"portfolioId": string,
	"imageUrl": string,
	"description": string,
	"twitterUserName": string,
	"title": string
}

```

The request will fail with a status code 400 if none of them is provided. **The service only will change the sent fields**, none of them is required but at least one of them.

## How to run the Front-end app

1.  Change the directory to **portfolio-app** inside the repository  and install the dependencies
```

$ cd portfolio-app/ && npm install

```

2.  Change the name of **.env.copy** into **.env**
3. Please fill the file with the **ENV VARIABLES PROVIDED BY ME**

```
PORT=3000
PORTFOLIO_API_URL="xxxxx"
TWITTER_API_URL="xxxx"
TWITTER_API_TOKEN="xxxxxx"
TWITTER_CONSUMER_KEY="xxxxx"
TWITTER_CONSUMER_SECRET="xxxx"
TWITTER_ACCESS_TOKEN="xxxxx"
TWITTER_TOKEN_SECRET="xxxx"

```
4. Now you can run de app using **npm start**
```
$ npm start
```

5.  Finally, open a web browser and navigate to **http://localhost:3000/** and the application should be running
