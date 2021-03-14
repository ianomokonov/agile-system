import { TokensResponse } from 'back/src/models/responses/tokens.response';
import { authTokenKey, refreshTokenKey } from '../utils/constants';

export class TokenService {
  public getRefreshToken() {
    return sessionStorage.getItem(refreshTokenKey);
  }

  public getAuthToken() {
    return sessionStorage.getItem(authTokenKey);
  }

  public storeTokens(tokens: TokensResponse) {
    sessionStorage.setItem(authTokenKey, tokens.accessToken);
    sessionStorage.setItem(refreshTokenKey, tokens.refreshToken);
  }

  public removeTokens() {
    sessionStorage.removeItem(authTokenKey);
    sessionStorage.removeItem(refreshTokenKey);
  }
}
