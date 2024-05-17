import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * @description ping 테스트
   */
  @Get('/')
  async ping() {
    this.logger.info('!!!!!!!!!!!!!!!!! ping !!!!!!!!!!!!!!!!!');
    return 'ping';
  }

  /**
   * @description google 로그인을 위한 Redirect URL 반환
   */
  @Get('/google')
  async login() {
    return await this.authService.getGoogleAuthUrl();
  }

  /**
   * @description 로그인 콜백 핸들러
   */
  @Post('/callback')
  async authCallback(
    @Body() body: { access_token: string; refresh_token: string },
  ) {
    return await this.authService.handleAuthCallback(
      body.access_token,
      body.refresh_token,
    );
  }

  /**
   * @description 토큰 리프레시 API
   */
  @Post('/refresh')
  async refreshToken(@Body() body: { refresh_token: string }) {
    return await this.authService.refreshAccessToken(body.refresh_token);
  }
}
