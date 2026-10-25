import {Type} from 'class-transformer';import {ArrayMaxSize,ArrayMinSize,IsArray,IsEmail,IsIn,IsOptional,IsString,IsUUID,MaxLength,MinLength,ValidateNested} from 'class-validator';
export class LeadRowDto {@IsString() @MinLength(1) @MaxLength(120) name!:string;@IsOptional() @IsEmail() @MaxLength(200) email?:string;@IsOptional() @IsString() @MaxLength(40) phone?:string;@IsOptional() @IsString() @MaxLength(120) company?:string;}
export class LeadImportDto {@IsUUID() importKey!:string;@IsIn(['contacts','website','whatsapp']) source!:string;@IsArray() @ArrayMinSize(1) @ArrayMaxSize(50) @ValidateNested({each:true}) @Type(()=>LeadRowDto) rows!:LeadRowDto[];}
export class WebsiteLeadDto extends LeadRowDto {@IsUUID() eventKey!:string;}
