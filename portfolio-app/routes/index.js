const express = require("express");
const router = express.Router();
const { getUserPortfolios, getPortfolio } = require("../services/portfolio");
const {getTimelineTweetsByUsername} = require("../services/twitter");

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    let portfolios = await getUserPortfolios();
    portfolios = portfolios.filter((portfolio) => portfolio.twitterUserName);
    return res.render("index", { title: "User Portfolios", portfolios });
  } catch (error) {
    console.log(error);
    return res.render("error", { error: error });
  }
});

router.get("/:portfolioId", async (req, res, next) => {
  try {
    const { portfolioId } = req.params;
    const portfolio = await getPortfolio(portfolioId);
    const timeLineTweets = await getTimelineTweetsByUsername(portfolio.twitterUserName);
    // const timeline
    return res.render("portfolio", { portfolio, timeLineTweets });
  } catch (error) {
    console.log(error);
    return res.render("error", { error: error });
  }
});

module.exports = router;
