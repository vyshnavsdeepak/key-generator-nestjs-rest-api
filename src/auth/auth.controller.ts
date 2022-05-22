import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('login')
  login(@Body() body: LoginUserDto) {
    return this.service.authenticateUser(body.userName, body.password);
  }

  @Post('register')
  register(@Body() body: CreateUserDto) {
    return this.service.createUser(body);
  }
}
