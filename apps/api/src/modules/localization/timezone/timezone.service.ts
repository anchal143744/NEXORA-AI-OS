import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TimeConversionDto } from '../dto/localization.dto';

@Injectable()
export class TimezoneService {
  constructor(private readonly prisma: PrismaService) {}

  async getTimezones(countryCode?: string) {
    const where: any = { deletedAt: null, enabled: true };
    if (countryCode) where.countryCode = countryCode.toUpperCase();
    const profiles = await this.prisma.localeProfile.findMany({ where, orderBy: [{ countryCode: 'asc' }, { timezone: 'asc' }] });
    if (profiles.length) return profiles.map((profile: any) => ({ timezone: profile.timezone, countryCode: profile.countryCode, locale: profile.locale, businessHours: profile.businessHours }));
    return [
      { timezone: 'UTC', countryCode: 'GLOBAL', locale: 'en', businessHours: { start: '09:00', end: '17:00', days: [1,2,3,4,5] } },
      { timezone: 'Asia/Kolkata', countryCode: 'IN', locale: 'en-IN', businessHours: { start: '09:30', end: '18:30', days: [1,2,3,4,5] } },
      { timezone: 'America/New_York', countryCode: 'US', locale: 'en-US', businessHours: { start: '09:00', end: '17:00', days: [1,2,3,4,5] } },
    ];
  }

  convert(dto: TimeConversionDto) {
    const date = new Date(dto.value);
    const converted = new Intl.DateTimeFormat('en-US', { timeZone: dto.toTimezone, dateStyle: 'medium', timeStyle: 'long' }).format(date);
    return { source: dto.value, fromTimezone: dto.fromTimezone, toTimezone: dto.toTimezone, converted, iso: date.toISOString(), businessHoursAware: Boolean(dto.respectBusinessHours) };
  }
}