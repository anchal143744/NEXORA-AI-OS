import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService, private readonly tenantContext: TenantContextService) {}

  async create(dto: CreateUserDto) {
    const tenantId = this.tenantContext.currentTenantId();
    if (dto.tenantId !== undefined && dto.tenantId !== tenantId) {
      throw new ForbiddenException('User tenant must match the current tenant');
    }
    const existing = await this.prisma.user.findUnique({ where: { tenantId_email: { tenantId, email: dto.email } } });
    if (existing) throw new ConflictException('User already exists');
    return this.prisma.user.create({ data: { tenantId, email: dto.email, displayName: dto.displayName, locale: dto.locale, status: 'ACTIVE' } });
  }

  async findByEmail(tenantId: string, email: string) {
    return this.prisma.user.findUnique({ where: { tenantId_email: { tenantId, email } } });
  }

  list() {
    return this.prisma.user.findMany({ where: { tenantId: this.tenantContext.currentTenantId(), deletedAt: null }, orderBy: { createdAt: 'desc' } });
  }

  async get(userId: string) {
    return this.requireById(this.tenantContext.currentTenantId(), userId);
  }

  async update(userId: string, dto: UpdateUserDto) {
    const tenantId = this.tenantContext.currentTenantId();
    const result = await this.prisma.user.updateMany({ where: { id: userId, tenantId, deletedAt: null }, data: dto });
    if (!result.count) throw new NotFoundException('User not found');
    return this.requireById(tenantId, userId);
  }

  async delete(userId: string) {
    const tenantId = this.tenantContext.currentTenantId();
    const result = await this.prisma.user.updateMany({ where: { id: userId, tenantId, deletedAt: null }, data: { status: 'DELETED', deletedAt: new Date() } });
    if (!result.count) throw new NotFoundException('User not found');
    return { deleted: true };
  }

  async requireById(tenantId: string, userId: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId, tenantId, deletedAt: null } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
