import { Controller, Post, Body } from "@nestjs/common";
import { CreateAuthRegisterDto } from "./dto/create-auth-register.dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: CreateAuthRegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body('email') email: string, @Body('password') password: string) {
    // Handle login logic here, e.g.:
    // return this.authService.login(email, password);
    return { email, password };
  }
}