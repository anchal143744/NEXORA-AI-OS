import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TranslationQueryDto, UpsertTranslationDto } from '../dto/localization.dto';

@Injectable()
export class TranslationService {
  constructor(private readonly prisma: PrismaService) {}

  async getTranslations(query: TranslationQueryDto) {
    const locale = query.locale ?? 'default';
    const keys = await this.prisma.translationKey.findMany({ where: { namespace: query.namespace, deletedAt: null }, orderBy: { key: 'asc' } });
    const values = await this.prisma.translationValue.findMany({ where: { languageCode: query.languageCode, locale, key: { namespace: query.namespace, deletedAt: null }, deletedAt: null }, include: { key: true } });
    const byKey = new Map(values.map((entry: any) => [entry.key.key, entry.value]));
    return keys.reduce((acc: Record<string, string>, key: any) => { acc[key.key] = byKey.get(key.key) ?? key.defaultValue ?? key.key; return acc; }, {});
  }

  async upsertTranslation(dto: UpsertTranslationDto) {
    const locale = dto.locale ?? 'default';
    const key = await this.prisma.translationKey.upsert({
      where: { namespace_key: { namespace: dto.namespace, key: dto.key } },
      update: { defaultValue: dto.value, metadata: dto.metadata ?? {} },
      create: { namespace: dto.namespace, key: dto.key, defaultValue: dto.value, metadata: dto.metadata ?? {} },
    });
    return this.prisma.translationValue.upsert({
      where: { translationKeyId_languageCode_locale: { translationKeyId: key.id, languageCode: dto.languageCode, locale } },
      update: { value: dto.value, metadata: dto.metadata ?? {} },
      create: { translationKeyId: key.id, languageCode: dto.languageCode, locale, value: dto.value, metadata: dto.metadata ?? {} },
    });
  }
}