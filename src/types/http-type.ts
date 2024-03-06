import { Request } from 'express';
import { GoogleLoginDto } from '@dto/google-login-dto';

export interface IGoogleCallbackRequest extends Request {
  user: GoogleLoginDto;
}

export interface IStatus {
  message: string;
  error?: string;
}
