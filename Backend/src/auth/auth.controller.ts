
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";

import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(
      loginDto.identifier,
      loginDto.password,
    );
  }

  @Post("verify-email")
  verifyEmail(@Body("code") code: string) {
    return this.authService.verifyEmail(code);
  }

  @Post("resend-verification")
  resendVerificationEmail(@Body("email") email: string) {
    return this.authService.resendVerificationEmail(email);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  getMe(@Request() req: any) {
    return { user: req.user };
  }
}