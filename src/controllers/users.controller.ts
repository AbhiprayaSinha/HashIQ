import { Controller } from '@nestjs/common';
import { UsersService } from '@services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  async getUserById(id: string) {
    return await this.usersService.getUserById(id);
  }
}
