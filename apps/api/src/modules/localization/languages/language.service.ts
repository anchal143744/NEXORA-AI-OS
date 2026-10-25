import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { SUPPORTED_LANGUAGE_CODES } from '../dto/localization.dto';

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English', es: 'Spanish', fr: 'French', de: 'German', it: 'Italian', pt: 'Portuguese', ar: 'Arabic', hi: 'Hindi', zh: 'Chinese', ja: 'Japanese', ko: 'Korean', ru: 'Russian', tr: 'Turkish', nl: 'Dutch', vi: 'Vietnamese', th: 'Thai',
};

@Injectable()
export class LanguageService {
  constructor(private readonly prisma: PrismaService) {}

  supportedLanguageCodes() { return [...SUPPORTED_LANGUAGE_CODES]; }

  async getSupportedLanguages() {
    const existing = await this.prisma.language.findMany({ where: { deletedAt: null, enabled: true }, orderBy: { code: 'asc' } });
    if (existing.length) return existing;
    return SUPPORTED_LANGUAGE_CODES.map((code) => ({ code, name: LANGUAGE_NAMES[code], nativeName: LANGUAGE_NAMES[code], direction: code === 'ar' ? 'rtl' : 'ltr', enabled: true }));
  }

  detectLanguage(input?: { acceptLanguage?: string; locale?: string; countryCode?: string }) {
    const raw = input?.locale ?? input?.acceptLanguage?.split(',')[0] ?? '';
    const code = raw.toLowerCase().split(/[-_]/)[0];
    return SUPPORTED_LANGUAGE_CODES.includes(code as any) ? code : this.defaultLanguageForCountry(input?.countryCode);
  }

  private defaultLanguageForCountry(countryCode?: string) {
    const map: Record<string, string> = { ES: 'es', MX: 'es', FR: 'fr', DE: 'de', IT: 'it', PT: 'pt', BR: 'pt', AE: 'ar', SA: 'ar', IN: 'hi', CN: 'zh', JP: 'ja', KR: 'ko', RU: 'ru', TR: 'tr', NL: 'nl', VN: 'vi', TH: 'th' };
    return map[(countryCode ?? '').toUpperCase()] ?? 'en';
  }
}