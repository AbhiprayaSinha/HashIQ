import { 
    Injectable, 
    CanActivate, 
    ExecutionContext 
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { configService } from '@services/config.service';

@Injectable()
export class ExecutionEngineGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return configService.isDockerInstalled();
  }
}