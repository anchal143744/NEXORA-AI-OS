import { Injectable } from '@nestjs/common';
export type DataClass = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
@Injectable()
export class DataClassificationService { classify(resourceType: string, fields: string[] = []) { const sensitive = ['password','token','secret','key','email','phone','address','taxId']; const restricted = fields.some(f => sensitive.some(s => f.toLowerCase().includes(s.toLowerCase()))); const classification: DataClass = restricted ? 'RESTRICTED' : resourceType.includes('audit') ? 'CONFIDENTIAL' : 'INTERNAL'; return { resourceType, classification, fields }; } }
