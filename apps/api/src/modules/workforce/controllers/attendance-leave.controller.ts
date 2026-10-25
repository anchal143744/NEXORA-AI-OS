import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateAttendanceDto, CreateAttendanceLogDto, CreateLeaveRequestDto, CreateLeaveBalanceDto, CreateHolidayCalendarDto, CreateShiftScheduleDto } from '../dto/workforce.dto';
import { WorkforceAnalyticsService } from '../workforce-analytics.service';
import { WorkforceCommandService } from '../workforce-command.service';
import { WorkforceQueryService } from '../workforce-query.service';

@ApiTags('Attendance and Leave Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'attendance-leave', version: '1' })
export class AttendanceLeaveController {
  constructor(private readonly commands: WorkforceCommandService, private readonly queries: WorkforceQueryService, private readonly analytics: WorkforceAnalyticsService) {}

  @Get('dashboard') dashboard() {
    return this.analytics.dashboard('Attendance and Leave Management');
  }

  @Get('attendance') listAttendance(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('attendance', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('attendance') createAttendance(@Body() dto: CreateAttendanceDto) {
    return this.commands.create('attendance', dto);
  }

  @Get('attendance-logs') listAttendanceLog(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('attendanceLog', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('attendance-logs') createAttendanceLog(@Body() dto: CreateAttendanceLogDto) {
    return this.commands.create('attendanceLog', dto);
  }

  @Get('leave-requests') listLeaveRequest(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('leaveRequest', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('leave-requests') createLeaveRequest(@Body() dto: CreateLeaveRequestDto) {
    return this.commands.create('leaveRequest', dto);
  }

  @Get('leave-balances') listLeaveBalance(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('leaveBalance', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('leave-balances') createLeaveBalance(@Body() dto: CreateLeaveBalanceDto) {
    return this.commands.create('leaveBalance', dto);
  }

  @Get('holiday-calendars') listHolidayCalendar(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('holidayCalendar', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('holiday-calendars') createHolidayCalendar(@Body() dto: CreateHolidayCalendarDto) {
    return this.commands.create('holidayCalendar', dto);
  }

  @Get('shift-schedules') listShiftSchedule(@Query('status') status?: string, @Query('stage') stage?: string, @Query('employeeId') employeeId?: string, @Query('candidateId') candidateId?: string, @Query('departmentId') departmentId?: string, @Query('riskLevel') riskLevel?: string) {
    return this.queries.list('shiftSchedule', { status, stage, employeeId, candidateId, departmentId, riskLevel });
  }

  @Post('shift-schedules') createShiftSchedule(@Body() dto: CreateShiftScheduleDto) {
    return this.commands.create('shiftSchedule', dto);
  }
}

