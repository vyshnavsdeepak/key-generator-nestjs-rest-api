import { HttpException, Injectable } from '@nestjs/common';
import { randomBytes, scrypt } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AccessToken } from './entities/access-token.entity';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async createUser(createUserDto: CreateUserDto) {
    const passwordHash = await this.hashPassword(createUserDto.password);
    const insert = await this.usersService.create({
      ...createUserDto,
      passwordHash,
    });
    const token = this.getAccessToken(createUserDto.userName);
    return {
      userName: insert.userName,
      name: insert.name,
      jwt: {
        token: token.token,
        expires: token.expires,
      },
    };
  }

  async authenticateUser(userName: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(userName);
    if (user && (await this.verifyPassword(pass, user.passwordHash))) {
      return {
        userName,
        ...this.getAccessToken(userName),
      };
    }
    throw new HttpException('Invalid credentials', 401);
  }

  async validateUser(token: string, userName: string) {
    const decoded = this.decodeAccessToken(token);
    switch (decoded.type) {
      case 'integrity-error':
      case 'invalid-token':
        throw new HttpException('Invalid token', 401);
      case 'valid':
        return userName == decoded.session.userName;
    }
  }

  private hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = randomBytes(16).toString('hex');
      scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        else resolve(`${salt}:${derivedKey.toString('hex')}`);
      });
    });
  }

  private verifyPassword(password, hash) {
    return new Promise((resolve, reject) => {
      const [salt, key] = hash.split(':');
      scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(key == derivedKey.toString('hex'));
      });
    });
  }

  private getAccessToken(userName: string) {
    const accessToken = new AccessToken();
    accessToken.payload = {
      userName,
      dateCreated: Date.now(),
    };
    const token = accessToken.encodeSession();
    return token;
  }

  private decodeAccessToken(token: string) {
    const accessToken = new AccessToken();
    const decoded = accessToken.decodeSession(token);
    return decoded;
  }
}
