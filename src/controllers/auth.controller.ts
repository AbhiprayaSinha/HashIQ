// Nest Dependencies
import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

// Local Dependencies
import { CreateUserDto } from '@dto/create-user.dto';
import { AuthService } from '@services/auth.service';
import { LoginDto } from '@dto/login-dto';
import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard';
import { GoogleAuthGuard } from '@modules/auth/google-auth.guard';
import { IStatus, IGoogleCallbackRequest } from 'src/types/http-type';
import { Ip } from '@nestjs/common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() createUserDto: CreateUserDto): Promise<IStatus> {
    return await this.authService.signUp(createUserDto);
  }

  @Post('signin')
  async signIn(
    @Res() response: Response,
    @Body() loginDto: LoginDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
  ): Promise<void> {
    const accessToken = await this.authService.signIn(loginDto, userAgent, ip);
    response.setHeader('Authorization', 'Bearer ' + accessToken);
    response.setHeader('Access-Control-Expose-Headers', 'Authorization');
    response.status(HttpStatus.OK).send({ message: 'Login successful' });
  }

  @UseGuards(JwtAuthGuard)
  @Post('verifyToken')
  @HttpCode(HttpStatus.OK)
  async verifyToken(@Headers('Authorization') token: string): Promise<IStatus> {
    return { message: 'Token is valid' };
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth() {
    // initiates the Google OAuth2 login flow
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthCallback(
    @Req() request: IGoogleCallbackRequest,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
    @Res() response: Response,
  ): Promise<void> {
    const accessToken = await this.authService.signInWithGoogle(
      request.user,
      userAgent,
      ip,
    );
    response.setHeader('Authorization', 'Bearer ' + accessToken);
    response.setHeader('Access-Control-Expose-Headers', 'Authorization');
    response.send({ statusCode: 200, message: 'Login successful' });
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  async signOut(@Req() request: any): Promise<IStatus> {
    return await this.authService.signOut(request.user);
  }
}
