import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { User, Prisma, Role } from '@prisma/client'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    })
  }

  async findAll(params: {
    skip?: number
    take?: number
    cursor?: Prisma.UserWhereUniqueInput
    where?: Prisma.UserWhereInput
    orderBy?: Prisma.UserOrderByWithRelationInput
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    })
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput
    data: Prisma.UserUpdateInput
  }): Promise<User> {
    const { where, data } = params
    return this.prisma.user.update({
      data,
      where,
    })
  }

  async remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    })
  }

  // Business logic methods
  async activateUser(id: number): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        emailVerified: true,
      },
    })
  }

  async changeUserRole(id: number, role: Role): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    })
  }

  async getUsersCount(): Promise<number> {
    return this.prisma.user.count()
  }

  async getActiveUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        emailVerified: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }
}
