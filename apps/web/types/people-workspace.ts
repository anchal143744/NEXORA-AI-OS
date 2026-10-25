export type EmployeeStatus = 'active' | 'on_leave' | 'probation' | 'alumni';
export type AttendanceStatus = 'checked_in' | 'checked_out' | 'late' | 'remote';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export type CandidateStage = 'applied' | 'screening' | 'interview' | 'assessment' | 'offer' | 'hired' | 'rejected';
export type PerformanceRating = 'exceptional' | 'strong' | 'steady' | 'needs_support';

export interface PeopleMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
  trend: string;
  tone: 'healthy' | 'watch' | 'risk';
}

export interface EmployeeRecord {
  id: string;
  name: string;
  role: string;
  department: string;
  team: string;
  location: string;
  manager: string;
  status: EmployeeStatus;
  skills: string[];
  documents: string[];
  startDate: string;
  engagement: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  status: AttendanceStatus;
  checkIn: string;
  checkOut: string;
  hours: number;
  location: string;
}

export interface LeaveRequest {
  id: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: LeaveStatus;
  approver: string;
}

export interface LeaveBalance {
  employeeName: string;
  vacation: number;
  sick: number;
  personal: number;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  hiringManager: string;
  status: 'draft' | 'posted' | 'interviewing' | 'offer';
  candidates: number;
}

export interface CandidateRecord {
  id: string;
  name: string;
  role: string;
  stage: CandidateStage;
  score: number;
  source: string;
  owner: string;
  interviewDate: string;
  nextStep: string;
  skills: string[];
}

export interface PerformanceReview {
  id: string;
  employeeName: string;
  role: string;
  cycle: string;
  rating: PerformanceRating;
  feedback: string;
  developmentPlan: string;
}

export interface GoalRecord {
  id: string;
  owner: string;
  scope: 'employee' | 'team';
  title: string;
  progress: number;
  cycle: string;
}

export interface LearningRecord {
  id: string;
  title: string;
  type: 'course' | 'program' | 'certification';
  audience: string;
  completion: number;
  owner: string;
}

export interface OrgNode {
  id: string;
  name: string;
  role: string;
  department: string;
  managerId?: string;
}

export interface WorkforceMetric {
  id: string;
  label: string;
  value: string;
  signal: string;
  tone: 'healthy' | 'watch' | 'risk';
}

export interface AiHrInsight {
  id: string;
  title: string;
  summary: string;
  severity: 'opportunity' | 'risk' | 'info';
  action: string;
}

export interface AiHrCommandResult {
  id: string;
  command: string;
  response: string;
  recommendedActions: string[];
}

export interface PeopleWorkspaceData {
  metrics: PeopleMetric[];
  employees: EmployeeRecord[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  leaveBalances: LeaveBalance[];
  jobs: JobOpening[];
  candidates: CandidateRecord[];
  reviews: PerformanceReview[];
  goals: GoalRecord[];
  learning: LearningRecord[];
  orgNodes: OrgNode[];
  workforceMetrics: WorkforceMetric[];
  insights: AiHrInsight[];
}
