import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
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
   * @description SNS 로그인을 위한 Redirect URL 반환
   */
  @Get('/sns')
  async login(@Query('type') type) {
    return await this.authService.getSnsAuthUrl(type);
  }

  /**
   * @description 로그인 콜백 핸들러
   */
  @Post('/callback')
  async authCallback(
    @Body() body: { accessToken: string; refreshToken: string },
  ) {
    return await this.authService.handleAuthCallback(
      body.accessToken,
      body.refreshToken,
    );
  }

  /**
   * @description 토큰 리프레시 API
   */
  @Post('/refresh')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return await this.authService.refreshAccessToken(body.refreshToken);
  }
}
