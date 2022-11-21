import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser(): any {
    return this.userService.getUser();
  }

  @Post()
  async createUser(@Body() dto: UserDto): Promise<any> {
    return await this.userService.createUser(dto);
  }

  @Post('/login')
  async login(@Body() dto: UserDto): Promise<any> {
    return await this.userService.login(dto);
  }
}
