import { Controller, Post, Body, Get, Req, UseGuards } from "@nestjs/common";
import type { Request } from 'express';
import { CreateAuthRegisterDto } from "./dto/create-auth-register.dto";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: CreateAuthRegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.login(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req: Request) {
    return this.authService.getProfile(req.user!);
  }
}