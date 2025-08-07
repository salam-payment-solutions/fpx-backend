import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User, Role } from '@prisma/client'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto)
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
  ): Promise<User[]> {
    return this.usersService.findAll({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
      where: search
        ? {
            OR: [
              { email: { contains: search } },
              { firstName: { contains: search } },
              { lastName: { contains: search } },
            ],
          }
        : undefined,
    })
  }

  @Get('count')
  getUsersCount(): Promise<number> {
    return this.usersService.getUsersCount()
  }

  @Get('active')
  getActiveUsers(): Promise<User[]> {
    return this.usersService.getActiveUsers()
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne({ id: +id })
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update({
      where: { id: +id },
      data: updateUserDto,
    })
  }

  @Patch(':id/activate')
  activateUser(@Param('id') id: string): Promise<User> {
    return this.usersService.activateUser(+id)
  }

  @Patch(':id/role')
  changeUserRole(@Param('id') id: string, @Body('role') role: Role): Promise<User> {
    return this.usersService.changeUserRole(+id, role)
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove({ id: +id })
  }
}
