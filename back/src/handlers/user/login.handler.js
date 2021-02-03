const refreshTokenService = require("../../services/refresh-token-service");
const { makeTokens } = require("../../utils");

module.exports = async (userId) => {
    const { accessToken, refreshToken } = makeTokens({ userId });

    await refreshTokenService.add(refreshToken);

    return { accessToken, refreshToken };
}