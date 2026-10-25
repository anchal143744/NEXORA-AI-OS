import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateBusinessDto {
  @ApiProperty()
  @IsUUID()
  organizationId!: string;

  @ApiProperty({ example: 'Nexora AI SaaS' })
  @IsString()
  @Length(2, 120)
  name!: string;

  @ApiProperty({ example: 'startup' })
  @IsString()
  businessType!: string;

  @ApiProperty({ example: 'software' })
  @IsString()
  industry!: string;

  @ApiPropertyOptional({ example: 'US' })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  countryCode?: string;

  @ApiPropertyOptional({ example: ['increase_revenue', 'improve_operations'] })
  @IsOptional()
  @IsArray()
  goals?: string[];
}
