import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user in current tenant' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List users in current tenant' })
  list() {
    return this.usersService.list();
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user in current tenant' })
  get(@Param('userId') userId: string) {
    return this.usersService.get(userId);
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update user in current tenant' })
  update(@Param('userId') userId: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(userId, dto);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Soft delete user in current tenant' })
  delete(@Param('userId') userId: string) {
    return this.usersService.delete(userId);
  }
}
