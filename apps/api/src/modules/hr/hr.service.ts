import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { BusinessAuditService } from '../audit/business-audit.service';
import { TenantContextService } from '../tenants/tenant-context.service';
import { AttendanceDto, CreateDepartmentDto, CreateHrEmployeeDto, UpdateEmployeeDto } from './dto/hr.dto';

type HrEmployeeRow = {
id:string;
employeeNumber:string;
department:string | null;
jobTitle:string | null;
employmentStatus:string;
startDate:Date | null;
};

type HrDepartmentRow = {
id:string;
name:string;
};

type HrAttendanceRow = {
id:string;
employeeId:string;
status:string;
checkInAt:Date | null;
checkOutAt:Date | null;
};

@Injectable()
export class HrService { constructor(private readonly prisma:PrismaService, private readonly context:TenantContextService, private readonly audit:BusinessAuditService){}
private tenantId(){return this.context.currentTenantId()} private workspaceId(){const id=this.context.currentWorkspaceId(); if(!id) throw new NotFoundException('Workspace context is required'); return id} private rec(a:'CREATE'|'UPDATE'|'DELETE',t:string,id:string,m:string){return this.audit.record({tenantId:this.tenantId(),userId:this.context.context()?.userId,action:a,resourceType:t,resourceId:id,message:m})}
async workspace(){const [employees,departments,attendance]=await Promise.all([this.directory(),this.listDepartments(),this.listAttendance()]); const active=employees.filter((employee: HrEmployeeRow)=>employee.employmentStatus==='ACTIVE').length; return {metrics:[{id:'total-employees',label:'Total Employees',value:String(employees.length),detail:'Tenant employee profiles',trend:employees.length?'real data':'no employee records',tone:'healthy'},{id:'active-employees',label:'Active Employees',value:String(active),detail:'Active employee profiles',trend:active?'real data':'empty',tone:'healthy'},{id:'departments',label:'Departments',value:String(departments.length),detail:'Workspace departments',trend:departments.length?'real data':'no departments',tone:'watch'}],employees:employees.map((employee: HrEmployeeRow)=>({id:employee.id,name:employee.employeeNumber,role:employee.jobTitle??'Unassigned',department:employee.department??'Unassigned',team:employee.department??'Unassigned',location:'Not set',manager:'Not set',status:employee.employmentStatus==='ACTIVE'?'active':'alumni',skills:[],documents:[],startDate:employee.startDate?.toISOString()??'',engagement:0})),attendance:attendance.map((item: HrAttendanceRow)=>({id:item.id,employeeId:item.employeeId,employeeName:item.employeeId,status:item.status,checkIn:item.checkInAt?.toISOString()??'-',checkOut:item.checkOutAt?.toISOString()??'-',hours:0,location:'Workspace'})),leaveRequests:[],leaveBalances:[],jobs:[],candidates:[],reviews:[],goals:[],learning:[],orgNodes:departments.map((department: HrDepartmentRow)=>({id:department.id,name:department.name,role:'Department',department:department.name})),workforceMetrics:[],insights:[]};}
runHrCommand(dto:{command:string}){return {id:'hr-command-'+Date.now(),command:dto.command,response:'People insights are limited to authorized employee, department and attendance records in this V1 workspace.',recommendedActions:['Create employee records','Keep departments current','Record attendance events']};}
async checkIn(employeeId:string){return this.recordAttendance({employeeId,workDate:new Date().toISOString(),status:'checked_in',checkInAt:new Date().toISOString()})}
async checkOut(employeeId:string){return this.recordAttendance({employeeId,workDate:new Date().toISOString(),status:'checked_out',checkOutAt:new Date().toISOString()})}
approveLeave(id:string){throw new NotFoundException(`Leave request ${id} is not available in the current V1 HR implementation`)}
moveCandidateStage(id:string,_dto:{stage:string}){throw new NotFoundException(`Candidate ${id} is not available in the current V1 HR implementation`)}
async createEmployee(dto:CreateHrEmployeeDto){const row=await this.prisma.employeeProfile.create({data:{tenantId:this.tenantId(),userId:dto.userId,employeeNumber:dto.employeeNumber,department:dto.department,jobTitle:dto.jobTitle,startDate:dto.startDate?new Date(dto.startDate):undefined}}); await this.rec('CREATE','hr.employee',row.id,'Employee created'); return row}
async updateEmployee(id:string,dto:UpdateEmployeeDto){const r=await this.prisma.employeeProfile.updateMany({where:{tenantId:this.tenantId(),id,deletedAt:null},data:dto}); if(!r.count) throw new NotFoundException('Employee not found'); await this.rec('UPDATE','hr.employee',id,'Employee updated'); return this.prisma.employeeProfile.findFirst({where:{tenantId:this.tenantId(),id}})}
directory(): Promise<HrEmployeeRow[]>{return this.prisma.employeeProfile.findMany({where:{tenantId:this.tenantId(),deletedAt:null},orderBy:{createdAt:'desc'}})}
async createDepartment(dto:CreateDepartmentDto){const row=await this.prisma.department.create({data:{tenantId:this.tenantId(),workspaceId:this.workspaceId(),name:dto.name,managerUserId:dto.managerUserId}}); await this.rec('CREATE','hr.department',row.id,'Department created'); return row}
listDepartments(): Promise<HrDepartmentRow[]>{return this.prisma.department.findMany({where:{tenantId:this.tenantId(),workspaceId:this.workspaceId(),deletedAt:null},orderBy:{name:'asc'}})}
listAttendance(): Promise<HrAttendanceRow[]>{return this.prisma.attendanceRecord.findMany({where:{tenantId:this.tenantId(),workspaceId:this.workspaceId(),deletedAt:null},orderBy:{createdAt:'desc'}})}
async recordAttendance(dto:AttendanceDto){const row=await this.prisma.attendanceRecord.create({data:{tenantId:this.tenantId(),workspaceId:this.workspaceId(),employeeId:dto.employeeId,workDate:new Date(dto.workDate),status:dto.status,checkInAt:dto.checkInAt?new Date(dto.checkInAt):undefined,checkOutAt:dto.checkOutAt?new Date(dto.checkOutAt):undefined}}); await this.rec('CREATE','hr.attendance',row.id,'Attendance recorded'); return row}
}
