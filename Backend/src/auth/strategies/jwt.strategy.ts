
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../users/entities/user.entity';

interface JwtPayload {
  sub: number;
  username: string;
  email: string;
}

const VALID_ROLES = ['student', 'teacher', 'tutor', 'admin'] as const;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error(
        'JWT_SECRET is not defined in the environment variables.',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User no longer exists.');
    }

    if (user.accountStatus !== 'active') {
      throw new UnauthorizedException(
        'This account is not active. Contact the administrator.',
      );
    }

    if (Number(user.emailVerified) !== 1) {
      throw new UnauthorizedException(
        'Please verify your email before accessing this resource.',
      );
    }

    if (!VALID_ROLES.includes(user.role as (typeof VALID_ROLES)[number])) {
      throw new UnauthorizedException(
        'This account has an invalid role. Contact the administrator.',
      );
    }

    const { password: _password, ...safeUser } = user;

    // Always return the current role and account status from Oracle.
    return safeUser;
  }
}
