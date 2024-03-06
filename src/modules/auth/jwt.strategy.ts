// Nest Dependencies
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

// Local Dependencies
import { configService } from '@services/config.service';
import { UsersService } from '@services/users.service';

// Other Dependencies
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Payload } from 'src/types/jwt-type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getEnv('JWT_SECRET'),
    });
  }

  async validate({ id, isAdmin, deviceId }: Payload) {
    const isDeviceExisting: boolean =
      await this.userService.checkIfDeviceExists(id, deviceId);

    if (!isDeviceExisting) {
      throw new UnauthorizedException('Invalid Token');
    }

    return { id, isAdmin, deviceId };
  }
}
