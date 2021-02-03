import refreshTokenService from "../../services/refresh-token-service";
import { makeTokens } from "../../utils";

module.exports = async (userId) => {
    const { accessToken, refreshToken } = makeTokens({ userId });

    await refreshTokenService.add(refreshToken);

    return { accessToken, refreshToken };
}