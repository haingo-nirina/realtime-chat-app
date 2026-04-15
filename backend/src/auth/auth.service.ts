import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException('Un utilisateur existe déjà avec cet email.');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.createLocalUser({
      username: registerDto.username,
      email: registerDto.email,
      password: hashedPassword,
    });

    return this.createToken(user);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(user: any) {
    return this.createToken(user);
  }

  async handleGoogleLogin(profile: any) {
    const email = profile?.emails?.[0]?.value;
    const googleId = profile.id;
    const username =
      profile?.displayName || email?.split('@')[0] || 'Utilisateur';

    if (!email) {
      throw new UnauthorizedException(
        'Impossible de récupérer l’adresse email depuis Google.',
      );
    }

    const existingByGoogleId = await this.usersService.findByGoogleId(googleId);
    if (existingByGoogleId) {
      return existingByGoogleId;
    }

    const existingByEmail = await this.usersService.findByEmail(email);
    if (existingByEmail) {
      if (!existingByEmail.googleId) {
        return this.usersService.attachGoogleId(existingByEmail.id, googleId);
      }
      return existingByEmail;
    }

    return this.usersService.createGoogleUser({
      username,
      email,
      googleId,
    });
  }

  private createToken(user: any) {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }
}
