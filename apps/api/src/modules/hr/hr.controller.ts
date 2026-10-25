import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../rbac/decorators/require-permissions.decorator';
import { RbacGuard } from '../rbac/guards/rbac.guard';
import { AttendanceDto, CreateDepartmentDto, CreateHrEmployeeDto, UpdateEmployeeDto } from './dto/hr.dto';
import { HrService } from './hr.service';
@ApiTags('HR') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RbacGuard) @Controller({path:'hr',version:'1'})
export class HrController{constructor(private readonly hr:HrService){}
@RequirePermissions('read')
@Get('workspace') workspace(){return this.hr.workspace()}
@RequirePermissions('execute')
@Post('ai-hr-copilot') runHrCommand(@Body() dto:{command:string}){return this.hr.runHrCommand(dto)}
@RequirePermissions('update')
@Post('attendance/:employeeId/check-in') checkIn(@Param('employeeId') employeeId:string){return this.hr.checkIn(employeeId)}
@RequirePermissions('update')
@Post('attendance/:employeeId/check-out') checkOut(@Param('employeeId') employeeId:string){return this.hr.checkOut(employeeId)}
@RequirePermissions('approve')
@Post('leave/:id/approve') approveLeave(@Param('id') id:string){return this.hr.approveLeave(id)}
@RequirePermissions('update')
@Patch('candidates/:id/stage') moveCandidate(@Param('id') id:string,@Body() dto:{stage:string}){return this.hr.moveCandidateStage(id,dto)}
@RequirePermissions('create')
@Post('employees') createEmployee(@Body() dto:CreateHrEmployeeDto){return this.hr.createEmployee(dto)}
@RequirePermissions('update')
@Patch('employees/:id') updateEmployee(@Param('id') id:string,@Body() dto:UpdateEmployeeDto){return this.hr.updateEmployee(id,dto)}
@RequirePermissions('read')
@Get('employees') directory(){return this.hr.directory()}
@RequirePermissions('create')
@Post('departments') createDepartment(@Body() dto:CreateDepartmentDto){return this.hr.createDepartment(dto)}
@RequirePermissions('read')
@Get('departments') listDepartments(){return this.hr.listDepartments()}
@RequirePermissions('create')
@Post('attendance') recordAttendance(@Body() dto:AttendanceDto){return this.hr.recordAttendance(dto)}
}
