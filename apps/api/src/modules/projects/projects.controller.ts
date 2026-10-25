import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Get } from '@nestjs/common';
import { RequirePermissions } from '../rbac/decorators/require-permissions.decorator';
import { RbacGuard } from '../rbac/guards/rbac.guard';
import { AssignTaskDto, CreateProjectDto, CreateTaskDto, TaskStatusDto, UpdateProjectDto } from './dto/projects.dto';
import { ProjectsService } from './projects.service';
@ApiTags('Projects & Tasks') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RbacGuard) @Controller({path:'projects',version:'1'})
export class ProjectsController{constructor(private readonly projects:ProjectsService){}
@RequirePermissions('read')
@Get() listProjects(){return this.projects.listProjects()}
@RequirePermissions('read')
@Get('tasks') listTasks(){return this.projects.listTasks()}
@RequirePermissions('create')
@Post() createProject(@Body() dto:CreateProjectDto){return this.projects.createProject(dto)}
@RequirePermissions('update')
@Patch(':id') updateProject(@Param('id') id:string,@Body() dto:UpdateProjectDto){return this.projects.updateProject(id,dto)}
@RequirePermissions('create')
@Post('tasks') createTask(@Body() dto:CreateTaskDto){return this.projects.createTask(dto)}
@RequirePermissions('update')
@Patch('tasks/:id/assign') assignTask(@Param('id') id:string,@Body() dto:AssignTaskDto){return this.projects.assignTask(id,dto)}
@RequirePermissions('update')
@Patch('tasks/:id/status') taskStatus(@Param('id') id:string,@Body() dto:TaskStatusDto){return this.projects.updateTaskStatus(id,dto)}
}
