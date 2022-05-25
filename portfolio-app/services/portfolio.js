const axios = require("axios").default;

module.exports.getUserPortfolios = async () => {
  const { PORTFOLIO_API_URL } = process.env;
  try {
    const { data: portfolios } = await axios.get(`${PORTFOLIO_API_URL}/user`);
    
    return portfolios
  } catch (error) {
    throw error;
  }
};

module.exports.getPortfolio = async (portfolioId) => {
  const { PORTFOLIO_API_URL } = process.env;
  try {
    const { data: portfolio } = await axios.get(`${PORTFOLIO_API_URL}/user/${portfolioId}`);
    
    return portfolio
  } catch (error) {
    throw error;
  }
}
