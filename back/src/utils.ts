import { constants } from "./constants";


export const makeTokens = (tokenData) => {
    const accessToken = jwt.sign(tokenData, constants.JWT_ACCESS_SECRET, { expiresIn: `600s` });
    const refreshToken = jwt.sign(tokenData, constants.JWT_REFRESH_SECRET);
    return { accessToken, refreshToken };
}