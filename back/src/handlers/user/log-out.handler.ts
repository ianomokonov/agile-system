import refreshTokenService from "../../services/refresh-token-service";


module.exports = (token) => {
    refreshTokenService.drop(token);
}