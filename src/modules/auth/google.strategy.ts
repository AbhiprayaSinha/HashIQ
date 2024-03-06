import { GoogleLoginDto } from '@dto/google-login-dto';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { configService } from '@services/config.service';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: configService.getEnv('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getEnv('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getEnv('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const googleLoginDto: GoogleLoginDto = {
      username: '',
      email: profile.email,
      firstname: profile.name.givenName,
      lastname: profile.name.familyName,
      profilePic: profile.photos[0].value,
    };
    done(null, googleLoginDto);
  }
}
