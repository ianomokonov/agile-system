import { TokensResponse } from 'back/src/models/responses/tokens.response';
import { authTokenKey, refreshTokenKey } from '../utils/constants';

export class TokenService {
  public getRefreshToken() {
    return localStorage.getItem(refreshTokenKey);
  }

  public getAuthToken() {
    return localStorage.getItem(authTokenKey);
  }

  public storeTokens(tokens: TokensResponse) {
    localStorage.setItem(authTokenKey, tokens.accessToken);
    localStorage.setItem(refreshTokenKey, tokens.refreshToken);
  }

  public removeTokens() {
    localStorage.removeItem(authTokenKey);
    localStorage.removeItem(refreshTokenKey);
  }
}
