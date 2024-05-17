import { Inject, Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import * as process from 'process';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class AuthService {
  private supabase;
  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * @description 구글 로그인 URL을 가져옵니다.
   * */
  async getSnsAuthUrl(type: string) {
    this.logger.info('!!!!!!!!!!!!!! getSnsAuthUrl !!!!!!!!!!!!!!');
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: type,
      options: {
        redirectTo: 'http://localhost:3000/auth/callback',
      },
    });

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * @description 로그인 콜백 핸들러 accessToken, refreshToken을 받아서 처리합니다.
   * 현재 구글만 구현
   * */
  async handleAuthCallback(accessToken: string, refreshToken: string) {
    this.logger.info('!!!!!!!!!!!!!! handleAuthCallback !!!!!!!!!!!!!!');
    this.logger.info(`accessToken:: ${accessToken}`);
    this.logger.info(`refreshToken:: ${refreshToken}`);

    // 이 예제에서는 단순히 토큰을 반환합니다.
    return { accessToken, refreshToken };
  }

  /**
   * @description 토큰 리프리세
   * TODO: data 에 유저 정보들이 다 담겨서 들어오는데 필터링 해서 보내줘야함
   * TODO: session 안에 access_token, refresh_token 정보가 다 들어있음
   * @param refreshToken
   * */
  async refreshAccessToken(refreshToken: string) {
    try {
      this.logger.info('!!!!!!!!!!!!!! refreshAccessToken !!!!!!!!!!!!!!');
      const { data, error } = await this.supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error) {
        throw error;
      }

      return {
        accessToken: data.user.session.access_token,
        refreshToken: data.user.session.refresh_token,
      };
    } catch (error) {
      this.logger.error('Error refreshing access token:', error);
      throw error;
    }
  }

  /**
   * @description 액세스 토큰을 확인합니다.
   * @description 현재 모든 api에 대해서 토큰 유호검사를 함
   * @param accessToken
   */
  async verifyAccessToken(accessToken: string) {
    try {
      this.logger.info('!!!!!!!!!!!!!! verifyAccessToken !!!!!!!!!!!!!!');
      const { data, error } = await this.supabase.auth.getUser(accessToken);
      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      this.logger.error('Error verifying access token:', error);
      throw error;
    }
  }
}
