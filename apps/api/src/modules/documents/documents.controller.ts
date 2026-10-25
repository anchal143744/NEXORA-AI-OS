import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto, CreateFolderDto, CreateUploadRecordDto } from './dto/documents.dto';
@ApiTags('Documents') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller({path:'documents',version:'1'})
export class DocumentsController{constructor(private readonly documents:DocumentsService){}
@Post('folders') createFolder(@Body() dto:CreateFolderDto){return this.documents.createFolder(dto)}
@Post('metadata') createDocument(@Body() dto:CreateDocumentDto){return this.documents.createDocument(dto)}
@Post('uploads') createUploadRecord(@Body() dto:CreateUploadRecordDto){return this.documents.createUploadRecord(dto)}
}
