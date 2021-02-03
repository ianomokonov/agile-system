const refreshTokenService = require("../../services/refresh-token-service");

module.exports = (token) => {
    refreshTokenService.drop(token);
}