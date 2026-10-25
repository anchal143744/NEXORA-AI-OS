import type { AiHrCommandResult, AiHrInsight, AttendanceRecord, CandidateRecord, CandidateStage, EmployeeRecord, GoalRecord, JobOpening, LearningRecord, LeaveBalance, LeaveRequest, OrgNode, PeopleMetric, PeopleWorkspaceData, PerformanceReview, WorkforceMetric } from '@/types/people-workspace';

export const candidateStages: Array<{ id: CandidateStage; label: string; description: string }> = [
  { id: 'applied', label: 'Applied', description: 'Application received and profile created.' },
  { id: 'screening', label: 'Screening', description: 'Recruiter screen and basic fit review.' },
  { id: 'interview', label: 'Interview', description: 'Hiring team conversation scheduled.' },
  { id: 'assessment', label: 'Assessment', description: 'Skills, case or work sample review.' },
  { id: 'offer', label: 'Offer', description: 'Compensation and approval workflow.' },
  { id: 'hired', label: 'Hired', description: 'Offer accepted and onboarding ready.' },
  { id: 'rejected', label: 'Rejected', description: 'Closed without hire.' },
];

export const peopleNavigation = [
  { group: 'People', items: ['Employees', 'Attendance', 'Leave'] },
  { group: 'Hiring', items: ['Jobs', 'Candidates', 'Interviews'] },
  { group: 'Growth', items: ['Performance', 'Learning', 'Goals'] },
  { group: 'Organization', items: ['Teams', 'Org Chart', 'Workforce Analytics'] },
];

export const employees: EmployeeRecord[] = [
  { id: 'emp-ava', name: 'Ava Martinez', role: 'Senior Account Executive', department: 'Revenue', team: 'Enterprise Sales', location: 'New York', manager: 'Maya Chen', status: 'active', skills: ['Enterprise selling', 'Forecasting', 'Negotiation'], documents: ['Offer letter', 'Compensation plan', 'Policy acknowledgment'], startDate: '2024-02-12', engagement: 91 },
  { id: 'emp-noah', name: 'Noah Williams', role: 'People Operations Lead', department: 'People', team: 'HR Operations', location: 'Chicago', manager: 'Elena Park', status: 'active', skills: ['HRIS', 'Employee relations', 'Compliance'], documents: ['Employment agreement', 'Security training'], startDate: '2023-09-18', engagement: 88 },
  { id: 'emp-iris', name: 'Iris Kapoor', role: 'Customer Success Manager', department: 'Customer Success', team: 'Enterprise CS', location: 'Bengaluru', manager: 'Maya Chen', status: 'on_leave', skills: ['Customer health', 'Renewals', 'Onboarding'], documents: ['Leave approval', 'Benefits update'], startDate: '2022-11-07', engagement: 86 },
  { id: 'emp-luca', name: 'Luca Rossi', role: 'Product Designer', department: 'Product', team: 'Experience Design', location: 'Milan', manager: 'Elena Park', status: 'probation', skills: ['Design systems', 'Research', 'Prototyping'], documents: ['Probation plan', 'Equipment record'], startDate: '2026-04-01', engagement: 79 },
  { id: 'emp-sophia', name: 'Sophia Nguyen', role: 'Learning Manager', department: 'People', team: 'Learning', location: 'Remote', manager: 'Noah Williams', status: 'active', skills: ['Learning paths', 'Coaching', 'Certification'], documents: ['Training policy', 'Certification record'], startDate: '2021-07-19', engagement: 94 },
];

export const attendance: AttendanceRecord[] = [
  { id: 'att-ava', employeeId: 'emp-ava', employeeName: 'Ava Martinez', status: 'checked_in', checkIn: '08:54', checkOut: '-', hours: 6.4, location: 'New York Office' },
  { id: 'att-noah', employeeId: 'emp-noah', employeeName: 'Noah Williams', status: 'remote', checkIn: '09:08', checkOut: '-', hours: 6.1, location: 'Remote' },
  { id: 'att-iris', employeeId: 'emp-iris', employeeName: 'Iris Kapoor', status: 'checked_out', checkIn: '-', checkOut: '-', hours: 0, location: 'Approved leave' },
  { id: 'att-luca', employeeId: 'emp-luca', employeeName: 'Luca Rossi', status: 'late', checkIn: '09:42', checkOut: '-', hours: 5.4, location: 'Milan Office' },
  { id: 'att-sophia', employeeId: 'emp-sophia', employeeName: 'Sophia Nguyen', status: 'checked_in', checkIn: '08:47', checkOut: '-', hours: 6.7, location: 'Remote' },
];

export const leaveRequests: LeaveRequest[] = [
  { id: 'leave-iris', employeeName: 'Iris Kapoor', type: 'Vacation', startDate: '2026-06-20', endDate: '2026-06-24', days: 3, status: 'approved', approver: 'Maya Chen' },
  { id: 'leave-luca', employeeName: 'Luca Rossi', type: 'Personal', startDate: '2026-06-27', endDate: '2026-06-27', days: 1, status: 'pending', approver: 'Elena Park' },
  { id: 'leave-ava', employeeName: 'Ava Martinez', type: 'Sick', startDate: '2026-07-02', endDate: '2026-07-03', days: 2, status: 'pending', approver: 'Maya Chen' },
];

export const leaveBalances: LeaveBalance[] = [
  { employeeName: 'Ava Martinez', vacation: 12, sick: 7, personal: 3 },
  { employeeName: 'Noah Williams', vacation: 15, sick: 8, personal: 2 },
  { employeeName: 'Iris Kapoor', vacation: 8, sick: 6, personal: 2 },
  { employeeName: 'Luca Rossi', vacation: 10, sick: 5, personal: 2 },
];

export const jobs: JobOpening[] = [
  { id: 'job-hrbp', title: 'Senior HR Business Partner', department: 'People', location: 'New York', hiringManager: 'Elena Park', status: 'posted', candidates: 18 },
  { id: 'job-recruiter', title: 'Technical Recruiter', department: 'People', location: 'Remote', hiringManager: 'Noah Williams', status: 'interviewing', candidates: 24 },
  { id: 'job-analyst', title: 'Workforce Analyst', department: 'People Analytics', location: 'Bengaluru', hiringManager: 'Sophia Nguyen', status: 'offer', candidates: 9 },
];

export const candidates: CandidateRecord[] = [
  { id: 'cand-amara', name: 'Amara Singh', role: 'Senior HR Business Partner', stage: 'interview', score: 91, source: 'Referral', owner: 'Noah Williams', interviewDate: '2026-06-24', nextStep: 'Schedule leadership panel.', skills: ['Employee relations', 'Coaching', 'Org design'] },
  { id: 'cand-ben', name: 'Ben Carter', role: 'Technical Recruiter', stage: 'screening', score: 82, source: 'Inbound', owner: 'Sophia Nguyen', interviewDate: '2026-06-22', nextStep: 'Complete recruiter screen.', skills: ['Sourcing', 'ATS', 'Stakeholder management'] },
  { id: 'cand-mei', name: 'Mei Lin', role: 'Workforce Analyst', stage: 'offer', score: 94, source: 'Agency', owner: 'Noah Williams', interviewDate: '2026-06-21', nextStep: 'Approve compensation package.', skills: ['People analytics', 'SQL', 'Forecasting'] },
  { id: 'cand-omar', name: 'Omar Haddad', role: 'Learning Specialist', stage: 'assessment', score: 76, source: 'LinkedIn', owner: 'Sophia Nguyen', interviewDate: '2026-06-25', nextStep: 'Review training design exercise.', skills: ['Instructional design', 'Facilitation'] },
  { id: 'cand-lena', name: 'Lena Novak', role: 'Technical Recruiter', stage: 'applied', score: 68, source: 'Career site', owner: 'Noah Williams', interviewDate: 'Pending', nextStep: 'Run qualification screen.', skills: ['Candidate experience', 'Scheduling'] },
];

export const reviews: PerformanceReview[] = [
  { id: 'rev-ava', employeeName: 'Ava Martinez', role: 'Senior Account Executive', cycle: 'H1 2026', rating: 'exceptional', feedback: 'Consistently exceeds enterprise sales goals while mentoring new sellers.', developmentPlan: 'Prepare for regional sales leadership path.' },
  { id: 'rev-noah', employeeName: 'Noah Williams', role: 'People Operations Lead', cycle: 'H1 2026', rating: 'strong', feedback: 'Improved HR operations speed and employee support quality.', developmentPlan: 'Build deeper analytics operating rhythm.' },
  { id: 'rev-luca', employeeName: 'Luca Rossi', role: 'Product Designer', cycle: 'Probation', rating: 'steady', feedback: 'Strong craft, still ramping on enterprise workflow complexity.', developmentPlan: 'Pair with senior design systems lead.' },
];

export const goals: GoalRecord[] = [
  { id: 'goal-people', owner: 'People Team', scope: 'team', title: 'Reduce hiring cycle time by 20%', progress: 64, cycle: 'Q3 2026' },
  { id: 'goal-learning', owner: 'Sophia Nguyen', scope: 'employee', title: 'Launch manager enablement path', progress: 72, cycle: 'Q3 2026' },
  { id: 'goal-engagement', owner: 'Noah Williams', scope: 'employee', title: 'Improve employee response SLA', progress: 81, cycle: 'Q3 2026' },
  { id: 'goal-sales', owner: 'Ava Martinez', scope: 'employee', title: 'Mentor two new enterprise reps', progress: 58, cycle: 'Q3 2026' },
];

export const learning: LearningRecord[] = [
  { id: 'learn-manager', title: 'Modern Manager Essentials', type: 'program', audience: 'Managers', completion: 68, owner: 'Sophia Nguyen' },
  { id: 'learn-security', title: 'Security and Privacy Foundations', type: 'course', audience: 'All employees', completion: 91, owner: 'Noah Williams' },
  { id: 'learn-sales', title: 'Enterprise Forecasting Certification', type: 'certification', audience: 'Revenue team', completion: 54, owner: 'Ava Martinez' },
  { id: 'learn-design', title: 'Design System Craft', type: 'course', audience: 'Product team', completion: 77, owner: 'Luca Rossi' },
];

export const orgNodes: OrgNode[] = [
  { id: 'org-elena', name: 'Elena Park', role: 'Chief People Officer', department: 'People' },
  { id: 'org-noah', name: 'Noah Williams', role: 'People Operations Lead', department: 'People', managerId: 'org-elena' },
  { id: 'org-sophia', name: 'Sophia Nguyen', role: 'Learning Manager', department: 'People', managerId: 'org-noah' },
  { id: 'org-maya', name: 'Maya Chen', role: 'VP Revenue', department: 'Revenue', managerId: 'org-elena' },
  { id: 'org-ava', name: 'Ava Martinez', role: 'Senior Account Executive', department: 'Revenue', managerId: 'org-maya' },
  { id: 'org-iris', name: 'Iris Kapoor', role: 'Customer Success Manager', department: 'Customer Success', managerId: 'org-maya' },
];

export function percentage(value: number) {
  return String(Math.round(value)) + '%';
}

export function createPeopleMetrics(): PeopleMetric[] {
  const active = employees.filter((employee) => employee.status === 'active').length;
  const openPositions = jobs.filter((job) => job.status !== 'draft').length;
  const pendingLeave = leaveRequests.filter((leave) => leave.status === 'pending').length;
  const attendanceRate = Math.round((attendance.filter((item) => item.status !== 'late').length / attendance.length) * 100);
  return [
    { id: 'total-employees', label: 'Total Employees', value: String(employees.length), detail: 'Employees in the current workspace', trend: '+4 this quarter', tone: 'healthy' },
    { id: 'active-employees', label: 'Active Employees', value: String(active), detail: 'Available and working today', trend: percentage((active / employees.length) * 100) + ' active', tone: 'healthy' },
    { id: 'open-positions', label: 'Open Positions', value: String(openPositions), detail: 'Posted or active hiring roles', trend: '3 priority roles', tone: 'watch' },
    { id: 'leave-requests', label: 'Leave Requests', value: String(pendingLeave), detail: 'Requests awaiting approval', trend: 'needs review', tone: pendingLeave > 0 ? 'watch' : 'healthy' },
    { id: 'attendance', label: 'Attendance Insights', value: percentage(attendanceRate), detail: 'On-time or approved attendance', trend: '+3 pts weekly', tone: attendanceRate >= 85 ? 'healthy' : 'watch' },
  ];
}

export function createWorkforceMetrics(): WorkforceMetric[] {
  return [
    { id: 'headcount', label: 'Headcount', value: String(employees.length), signal: '+4 planned hires', tone: 'healthy' },
    { id: 'attrition', label: 'Attrition', value: '4.2%', signal: 'Below risk threshold', tone: 'healthy' },
    { id: 'attendance-rate', label: 'Attendance Rate', value: '91%', signal: 'Healthy attendance rhythm', tone: 'healthy' },
    { id: 'hiring-rate', label: 'Hiring Rate', value: '38%', signal: 'Pipeline is improving', tone: 'watch' },
    { id: 'performance', label: 'Performance Trends', value: '82%', signal: 'Strong review cycle', tone: 'healthy' },
    { id: 'learning', label: 'Learning Completion', value: '73%', signal: 'Training push recommended', tone: 'watch' },
  ];
}

export function createHrInsights(): AiHrInsight[] {
  return [
    { id: 'leave-load', title: 'Leave approvals need a simple manager pass', summary: 'Two leave requests are pending and can be handled without HR escalation.', severity: 'info', action: 'Notify approvers for pending leave.' },
    { id: 'promotion-ready', title: 'Ava Martinez is promotion-ready', summary: 'Exceptional review, high engagement and leadership behavior indicate readiness for a larger role.', severity: 'opportunity', action: 'Create promotion calibration packet.' },
    { id: 'skill-gap', title: 'People analytics skill gap is emerging', summary: 'Workforce planning goals depend on analytics coverage and only one candidate is strong in forecasting.', severity: 'risk', action: 'Prioritize workforce analytics training.' },
    { id: 'learning-path', title: 'Manager enablement can improve team clarity', summary: 'Learning completion is good, but manager-specific training needs momentum.', severity: 'opportunity', action: 'Assign Modern Manager Essentials.' },
  ];
}

export function createPeopleWorkspaceData(): PeopleWorkspaceData {
  return {
    metrics: createPeopleMetrics(),
    employees,
    attendance,
    leaveRequests,
    leaveBalances,
    jobs,
    candidates,
    reviews,
    goals,
    learning,
    orgNodes,
    workforceMetrics: createWorkforceMetrics(),
    insights: createHrInsights(),
  };
}

export function runAiHrCommand(command: string, data = createPeopleWorkspaceData()): AiHrCommandResult {
  const normalized = command.toLowerCase();
  const onLeave = data.employees.filter((employee) => employee.status === 'on_leave');
  const promotionReady = data.reviews.filter((review) => review.rating === 'exceptional');
  const gaps = ['People analytics', 'Manager coaching', 'Enterprise forecasting'];
  let response = 'I reviewed people, attendance, leave, hiring, performance and learning signals.';
  let recommendedActions = data.insights.map((insight) => insight.action);

  if (normalized.includes('on leave')) {
    response = 'Employees on leave: ' + onLeave.map((employee) => employee.name).join(', ') + '.';
    recommendedActions = ['Check coverage plans', 'Notify managers', 'Confirm leave calendar visibility'];
  } else if (normalized.includes('attendance')) {
    response = 'Attendance trend is healthy at 91%, with one late check-in and one approved leave today.';
    recommendedActions = ['Review late pattern for Luca Rossi', 'Share attendance summary with managers'];
  } else if (normalized.includes('promotion')) {
    response = 'Promotion-ready employees: ' + promotionReady.map((review) => review.employeeName).join(', ') + '.';
    recommendedActions = ['Create calibration packet', 'Review compensation band', 'Schedule manager discussion'];
  } else if (normalized.includes('hiring pipeline')) {
    response = 'Hiring pipeline has ' + String(data.candidates.length) + ' candidates, with Mei Lin in offer and Amara Singh in interview.';
    recommendedActions = ['Approve Mei Lin offer', 'Schedule Amara panel interview', 'Move recruiter screen candidates forward'];
  } else if (normalized.includes('skill gap')) {
    response = 'Skill gaps detected: ' + gaps.join(', ') + '.';
    recommendedActions = ['Assign analytics learning path', 'Open workforce analyst capacity', 'Pair managers with learning coach'];
  } else if (normalized.includes('training')) {
    response = 'Training programs to prioritize: Modern Manager Essentials, Security Foundations and Enterprise Forecasting Certification.';
    recommendedActions = ['Assign manager program', 'Remind revenue team on forecasting certification', 'Track completion weekly'];
  }

  return {
    id: 'hr-command-' + Date.now(),
    command,
    response,
    recommendedActions: recommendedActions.slice(0, 4),
  };
}
