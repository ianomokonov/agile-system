import refreshTokenService from '../../services/refresh-token-service';

export default (token) => {
  refreshTokenService.drop(token);
};
