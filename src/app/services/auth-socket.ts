import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
// import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';

@Injectable()
export class AuthSocket extends Socket {
  constructor(private authService: TokenService) {
    super({
      url: '',
      options: { query: { token: authService.getAuthToken() || '' } },
    });

    // Set token as part of the query object
    // this.ioSocket.query = {
    //   token: this.authService.getAuthToken() || '',
    // };
  }
}
