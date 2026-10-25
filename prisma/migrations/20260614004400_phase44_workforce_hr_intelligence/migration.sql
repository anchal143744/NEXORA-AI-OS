CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS "Employee" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "Employee_tenantId_recordKey_key" ON "Employee" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "Employee_tenantId_workspaceId_idx" ON "Employee" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "Employee_tenantId_status_idx" ON "Employee" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "Employee_employeeId_idx" ON "Employee" ("employeeId");
CREATE INDEX IF NOT EXISTS "Employee_candidateId_idx" ON "Employee" ("candidateId");
CREATE INDEX IF NOT EXISTS "Employee_departmentId_idx" ON "Employee" ("departmentId");
CREATE INDEX IF NOT EXISTS "Employee_stage_idx" ON "Employee" ("stage");


CREATE TABLE IF NOT EXISTS "EmployeeProfileExtension" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "EmployeeProfileExtension_tenantId_recordKey_key" ON "EmployeeProfileExtension" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "EmployeeProfileExtension_tenantId_workspaceId_idx" ON "EmployeeProfileExtension" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "EmployeeProfileExtension_tenantId_status_idx" ON "EmployeeProfileExtension" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "EmployeeProfileExtension_employeeId_idx" ON "EmployeeProfileExtension" ("employeeId");
CREATE INDEX IF NOT EXISTS "EmployeeProfileExtension_candidateId_idx" ON "EmployeeProfileExtension" ("candidateId");
CREATE INDEX IF NOT EXISTS "EmployeeProfileExtension_departmentId_idx" ON "EmployeeProfileExtension" ("departmentId");
CREATE INDEX IF NOT EXISTS "EmployeeProfileExtension_stage_idx" ON "EmployeeProfileExtension" ("stage");


CREATE TABLE IF NOT EXISTS "EmployeeSkill" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "EmployeeSkill_tenantId_recordKey_key" ON "EmployeeSkill" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "EmployeeSkill_tenantId_workspaceId_idx" ON "EmployeeSkill" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "EmployeeSkill_tenantId_status_idx" ON "EmployeeSkill" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "EmployeeSkill_employeeId_idx" ON "EmployeeSkill" ("employeeId");
CREATE INDEX IF NOT EXISTS "EmployeeSkill_candidateId_idx" ON "EmployeeSkill" ("candidateId");
CREATE INDEX IF NOT EXISTS "EmployeeSkill_departmentId_idx" ON "EmployeeSkill" ("departmentId");
CREATE INDEX IF NOT EXISTS "EmployeeSkill_stage_idx" ON "EmployeeSkill" ("stage");


CREATE TABLE IF NOT EXISTS "EmployeeDocument" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "EmployeeDocument_tenantId_recordKey_key" ON "EmployeeDocument" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "EmployeeDocument_tenantId_workspaceId_idx" ON "EmployeeDocument" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "EmployeeDocument_tenantId_status_idx" ON "EmployeeDocument" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "EmployeeDocument_employeeId_idx" ON "EmployeeDocument" ("employeeId");
CREATE INDEX IF NOT EXISTS "EmployeeDocument_candidateId_idx" ON "EmployeeDocument" ("candidateId");
CREATE INDEX IF NOT EXISTS "EmployeeDocument_departmentId_idx" ON "EmployeeDocument" ("departmentId");
CREATE INDEX IF NOT EXISTS "EmployeeDocument_stage_idx" ON "EmployeeDocument" ("stage");


CREATE TABLE IF NOT EXISTS "EmployeeHistory" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "EmployeeHistory_tenantId_recordKey_key" ON "EmployeeHistory" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "EmployeeHistory_tenantId_workspaceId_idx" ON "EmployeeHistory" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "EmployeeHistory_tenantId_status_idx" ON "EmployeeHistory" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "EmployeeHistory_employeeId_idx" ON "EmployeeHistory" ("employeeId");
CREATE INDEX IF NOT EXISTS "EmployeeHistory_candidateId_idx" ON "EmployeeHistory" ("candidateId");
CREATE INDEX IF NOT EXISTS "EmployeeHistory_departmentId_idx" ON "EmployeeHistory" ("departmentId");
CREATE INDEX IF NOT EXISTS "EmployeeHistory_stage_idx" ON "EmployeeHistory" ("stage");


CREATE TABLE IF NOT EXISTS "EmployeeRelationship" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "EmployeeRelationship_tenantId_recordKey_key" ON "EmployeeRelationship" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "EmployeeRelationship_tenantId_workspaceId_idx" ON "EmployeeRelationship" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "EmployeeRelationship_tenantId_status_idx" ON "EmployeeRelationship" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "EmployeeRelationship_employeeId_idx" ON "EmployeeRelationship" ("employeeId");
CREATE INDEX IF NOT EXISTS "EmployeeRelationship_candidateId_idx" ON "EmployeeRelationship" ("candidateId");
CREATE INDEX IF NOT EXISTS "EmployeeRelationship_departmentId_idx" ON "EmployeeRelationship" ("departmentId");
CREATE INDEX IF NOT EXISTS "EmployeeRelationship_stage_idx" ON "EmployeeRelationship" ("stage");


CREATE TABLE IF NOT EXISTS "JobRequisition" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "JobRequisition_tenantId_recordKey_key" ON "JobRequisition" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "JobRequisition_tenantId_workspaceId_idx" ON "JobRequisition" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "JobRequisition_tenantId_status_idx" ON "JobRequisition" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "JobRequisition_employeeId_idx" ON "JobRequisition" ("employeeId");
CREATE INDEX IF NOT EXISTS "JobRequisition_candidateId_idx" ON "JobRequisition" ("candidateId");
CREATE INDEX IF NOT EXISTS "JobRequisition_departmentId_idx" ON "JobRequisition" ("departmentId");
CREATE INDEX IF NOT EXISTS "JobRequisition_stage_idx" ON "JobRequisition" ("stage");


CREATE TABLE IF NOT EXISTS "JobPosting" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "JobPosting_tenantId_recordKey_key" ON "JobPosting" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "JobPosting_tenantId_workspaceId_idx" ON "JobPosting" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "JobPosting_tenantId_status_idx" ON "JobPosting" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "JobPosting_employeeId_idx" ON "JobPosting" ("employeeId");
CREATE INDEX IF NOT EXISTS "JobPosting_candidateId_idx" ON "JobPosting" ("candidateId");
CREATE INDEX IF NOT EXISTS "JobPosting_departmentId_idx" ON "JobPosting" ("departmentId");
CREATE INDEX IF NOT EXISTS "JobPosting_stage_idx" ON "JobPosting" ("stage");


CREATE TABLE IF NOT EXISTS "Candidate" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "Candidate_tenantId_recordKey_key" ON "Candidate" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "Candidate_tenantId_workspaceId_idx" ON "Candidate" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "Candidate_tenantId_status_idx" ON "Candidate" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "Candidate_employeeId_idx" ON "Candidate" ("employeeId");
CREATE INDEX IF NOT EXISTS "Candidate_candidateId_idx" ON "Candidate" ("candidateId");
CREATE INDEX IF NOT EXISTS "Candidate_departmentId_idx" ON "Candidate" ("departmentId");
CREATE INDEX IF NOT EXISTS "Candidate_stage_idx" ON "Candidate" ("stage");


CREATE TABLE IF NOT EXISTS "CandidateProfile" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "CandidateProfile_tenantId_recordKey_key" ON "CandidateProfile" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "CandidateProfile_tenantId_workspaceId_idx" ON "CandidateProfile" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "CandidateProfile_tenantId_status_idx" ON "CandidateProfile" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "CandidateProfile_employeeId_idx" ON "CandidateProfile" ("employeeId");
CREATE INDEX IF NOT EXISTS "CandidateProfile_candidateId_idx" ON "CandidateProfile" ("candidateId");
CREATE INDEX IF NOT EXISTS "CandidateProfile_departmentId_idx" ON "CandidateProfile" ("departmentId");
CREATE INDEX IF NOT EXISTS "CandidateProfile_stage_idx" ON "CandidateProfile" ("stage");


CREATE TABLE IF NOT EXISTS "Interview" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "Interview_tenantId_recordKey_key" ON "Interview" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "Interview_tenantId_workspaceId_idx" ON "Interview" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "Interview_tenantId_status_idx" ON "Interview" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "Interview_employeeId_idx" ON "Interview" ("employeeId");
CREATE INDEX IF NOT EXISTS "Interview_candidateId_idx" ON "Interview" ("candidateId");
CREATE INDEX IF NOT EXISTS "Interview_departmentId_idx" ON "Interview" ("departmentId");
CREATE INDEX IF NOT EXISTS "Interview_stage_idx" ON "Interview" ("stage");


CREATE TABLE IF NOT EXISTS "InterviewFeedback" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "InterviewFeedback_tenantId_recordKey_key" ON "InterviewFeedback" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "InterviewFeedback_tenantId_workspaceId_idx" ON "InterviewFeedback" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "InterviewFeedback_tenantId_status_idx" ON "InterviewFeedback" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "InterviewFeedback_employeeId_idx" ON "InterviewFeedback" ("employeeId");
CREATE INDEX IF NOT EXISTS "InterviewFeedback_candidateId_idx" ON "InterviewFeedback" ("candidateId");
CREATE INDEX IF NOT EXISTS "InterviewFeedback_departmentId_idx" ON "InterviewFeedback" ("departmentId");
CREATE INDEX IF NOT EXISTS "InterviewFeedback_stage_idx" ON "InterviewFeedback" ("stage");


CREATE TABLE IF NOT EXISTS "OfferLetter" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "OfferLetter_tenantId_recordKey_key" ON "OfferLetter" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "OfferLetter_tenantId_workspaceId_idx" ON "OfferLetter" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "OfferLetter_tenantId_status_idx" ON "OfferLetter" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "OfferLetter_employeeId_idx" ON "OfferLetter" ("employeeId");
CREATE INDEX IF NOT EXISTS "OfferLetter_candidateId_idx" ON "OfferLetter" ("candidateId");
CREATE INDEX IF NOT EXISTS "OfferLetter_departmentId_idx" ON "OfferLetter" ("departmentId");
CREATE INDEX IF NOT EXISTS "OfferLetter_stage_idx" ON "OfferLetter" ("stage");


CREATE TABLE IF NOT EXISTS "HiringPipeline" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "HiringPipeline_tenantId_recordKey_key" ON "HiringPipeline" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "HiringPipeline_tenantId_workspaceId_idx" ON "HiringPipeline" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "HiringPipeline_tenantId_status_idx" ON "HiringPipeline" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "HiringPipeline_employeeId_idx" ON "HiringPipeline" ("employeeId");
CREATE INDEX IF NOT EXISTS "HiringPipeline_candidateId_idx" ON "HiringPipeline" ("candidateId");
CREATE INDEX IF NOT EXISTS "HiringPipeline_departmentId_idx" ON "HiringPipeline" ("departmentId");
CREATE INDEX IF NOT EXISTS "HiringPipeline_stage_idx" ON "HiringPipeline" ("stage");


CREATE TABLE IF NOT EXISTS "OnboardingWorkflow" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "OnboardingWorkflow_tenantId_recordKey_key" ON "OnboardingWorkflow" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "OnboardingWorkflow_tenantId_workspaceId_idx" ON "OnboardingWorkflow" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "OnboardingWorkflow_tenantId_status_idx" ON "OnboardingWorkflow" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "OnboardingWorkflow_employeeId_idx" ON "OnboardingWorkflow" ("employeeId");
CREATE INDEX IF NOT EXISTS "OnboardingWorkflow_candidateId_idx" ON "OnboardingWorkflow" ("candidateId");
CREATE INDEX IF NOT EXISTS "OnboardingWorkflow_departmentId_idx" ON "OnboardingWorkflow" ("departmentId");
CREATE INDEX IF NOT EXISTS "OnboardingWorkflow_stage_idx" ON "OnboardingWorkflow" ("stage");


CREATE TABLE IF NOT EXISTS "OnboardingTask" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "OnboardingTask_tenantId_recordKey_key" ON "OnboardingTask" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "OnboardingTask_tenantId_workspaceId_idx" ON "OnboardingTask" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "OnboardingTask_tenantId_status_idx" ON "OnboardingTask" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "OnboardingTask_employeeId_idx" ON "OnboardingTask" ("employeeId");
CREATE INDEX IF NOT EXISTS "OnboardingTask_candidateId_idx" ON "OnboardingTask" ("candidateId");
CREATE INDEX IF NOT EXISTS "OnboardingTask_departmentId_idx" ON "OnboardingTask" ("departmentId");
CREATE INDEX IF NOT EXISTS "OnboardingTask_stage_idx" ON "OnboardingTask" ("stage");


CREATE TABLE IF NOT EXISTS "OnboardingChecklist" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "OnboardingChecklist_tenantId_recordKey_key" ON "OnboardingChecklist" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "OnboardingChecklist_tenantId_workspaceId_idx" ON "OnboardingChecklist" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "OnboardingChecklist_tenantId_status_idx" ON "OnboardingChecklist" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "OnboardingChecklist_employeeId_idx" ON "OnboardingChecklist" ("employeeId");
CREATE INDEX IF NOT EXISTS "OnboardingChecklist_candidateId_idx" ON "OnboardingChecklist" ("candidateId");
CREATE INDEX IF NOT EXISTS "OnboardingChecklist_departmentId_idx" ON "OnboardingChecklist" ("departmentId");
CREATE INDEX IF NOT EXISTS "OnboardingChecklist_stage_idx" ON "OnboardingChecklist" ("stage");


CREATE TABLE IF NOT EXISTS "EmployeeEquipment" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "EmployeeEquipment_tenantId_recordKey_key" ON "EmployeeEquipment" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "EmployeeEquipment_tenantId_workspaceId_idx" ON "EmployeeEquipment" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "EmployeeEquipment_tenantId_status_idx" ON "EmployeeEquipment" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "EmployeeEquipment_employeeId_idx" ON "EmployeeEquipment" ("employeeId");
CREATE INDEX IF NOT EXISTS "EmployeeEquipment_candidateId_idx" ON "EmployeeEquipment" ("candidateId");
CREATE INDEX IF NOT EXISTS "EmployeeEquipment_departmentId_idx" ON "EmployeeEquipment" ("departmentId");
CREATE INDEX IF NOT EXISTS "EmployeeEquipment_stage_idx" ON "EmployeeEquipment" ("stage");


CREATE TABLE IF NOT EXISTS "PolicyAcknowledgement" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "PolicyAcknowledgement_tenantId_recordKey_key" ON "PolicyAcknowledgement" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "PolicyAcknowledgement_tenantId_workspaceId_idx" ON "PolicyAcknowledgement" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "PolicyAcknowledgement_tenantId_status_idx" ON "PolicyAcknowledgement" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "PolicyAcknowledgement_employeeId_idx" ON "PolicyAcknowledgement" ("employeeId");
CREATE INDEX IF NOT EXISTS "PolicyAcknowledgement_candidateId_idx" ON "PolicyAcknowledgement" ("candidateId");
CREATE INDEX IF NOT EXISTS "PolicyAcknowledgement_departmentId_idx" ON "PolicyAcknowledgement" ("departmentId");
CREATE INDEX IF NOT EXISTS "PolicyAcknowledgement_stage_idx" ON "PolicyAcknowledgement" ("stage");


CREATE TABLE IF NOT EXISTS "Attendance" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "Attendance_tenantId_recordKey_key" ON "Attendance" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "Attendance_tenantId_workspaceId_idx" ON "Attendance" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "Attendance_tenantId_status_idx" ON "Attendance" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "Attendance_employeeId_idx" ON "Attendance" ("employeeId");
CREATE INDEX IF NOT EXISTS "Attendance_candidateId_idx" ON "Attendance" ("candidateId");
CREATE INDEX IF NOT EXISTS "Attendance_departmentId_idx" ON "Attendance" ("departmentId");
CREATE INDEX IF NOT EXISTS "Attendance_stage_idx" ON "Attendance" ("stage");


CREATE TABLE IF NOT EXISTS "AttendanceLog" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "AttendanceLog_tenantId_recordKey_key" ON "AttendanceLog" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "AttendanceLog_tenantId_workspaceId_idx" ON "AttendanceLog" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "AttendanceLog_tenantId_status_idx" ON "AttendanceLog" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "AttendanceLog_employeeId_idx" ON "AttendanceLog" ("employeeId");
CREATE INDEX IF NOT EXISTS "AttendanceLog_candidateId_idx" ON "AttendanceLog" ("candidateId");
CREATE INDEX IF NOT EXISTS "AttendanceLog_departmentId_idx" ON "AttendanceLog" ("departmentId");
CREATE INDEX IF NOT EXISTS "AttendanceLog_stage_idx" ON "AttendanceLog" ("stage");


CREATE TABLE IF NOT EXISTS "LeaveRequest" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "LeaveRequest_tenantId_recordKey_key" ON "LeaveRequest" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "LeaveRequest_tenantId_workspaceId_idx" ON "LeaveRequest" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "LeaveRequest_tenantId_status_idx" ON "LeaveRequest" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "LeaveRequest_employeeId_idx" ON "LeaveRequest" ("employeeId");
CREATE INDEX IF NOT EXISTS "LeaveRequest_candidateId_idx" ON "LeaveRequest" ("candidateId");
CREATE INDEX IF NOT EXISTS "LeaveRequest_departmentId_idx" ON "LeaveRequest" ("departmentId");
CREATE INDEX IF NOT EXISTS "LeaveRequest_stage_idx" ON "LeaveRequest" ("stage");


CREATE TABLE IF NOT EXISTS "LeaveBalance" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "LeaveBalance_tenantId_recordKey_key" ON "LeaveBalance" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "LeaveBalance_tenantId_workspaceId_idx" ON "LeaveBalance" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "LeaveBalance_tenantId_status_idx" ON "LeaveBalance" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "LeaveBalance_employeeId_idx" ON "LeaveBalance" ("employeeId");
CREATE INDEX IF NOT EXISTS "LeaveBalance_candidateId_idx" ON "LeaveBalance" ("candidateId");
CREATE INDEX IF NOT EXISTS "LeaveBalance_departmentId_idx" ON "LeaveBalance" ("departmentId");
CREATE INDEX IF NOT EXISTS "LeaveBalance_stage_idx" ON "LeaveBalance" ("stage");


CREATE TABLE IF NOT EXISTS "HolidayCalendar" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "HolidayCalendar_tenantId_recordKey_key" ON "HolidayCalendar" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "HolidayCalendar_tenantId_workspaceId_idx" ON "HolidayCalendar" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "HolidayCalendar_tenantId_status_idx" ON "HolidayCalendar" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "HolidayCalendar_employeeId_idx" ON "HolidayCalendar" ("employeeId");
CREATE INDEX IF NOT EXISTS "HolidayCalendar_candidateId_idx" ON "HolidayCalendar" ("candidateId");
CREATE INDEX IF NOT EXISTS "HolidayCalendar_departmentId_idx" ON "HolidayCalendar" ("departmentId");
CREATE INDEX IF NOT EXISTS "HolidayCalendar_stage_idx" ON "HolidayCalendar" ("stage");


CREATE TABLE IF NOT EXISTS "ShiftSchedule" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "ShiftSchedule_tenantId_recordKey_key" ON "ShiftSchedule" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "ShiftSchedule_tenantId_workspaceId_idx" ON "ShiftSchedule" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "ShiftSchedule_tenantId_status_idx" ON "ShiftSchedule" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "ShiftSchedule_employeeId_idx" ON "ShiftSchedule" ("employeeId");
CREATE INDEX IF NOT EXISTS "ShiftSchedule_candidateId_idx" ON "ShiftSchedule" ("candidateId");
CREATE INDEX IF NOT EXISTS "ShiftSchedule_departmentId_idx" ON "ShiftSchedule" ("departmentId");
CREATE INDEX IF NOT EXISTS "ShiftSchedule_stage_idx" ON "ShiftSchedule" ("stage");


CREATE TABLE IF NOT EXISTS "PerformanceReview" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "PerformanceReview_tenantId_recordKey_key" ON "PerformanceReview" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "PerformanceReview_tenantId_workspaceId_idx" ON "PerformanceReview" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "PerformanceReview_tenantId_status_idx" ON "PerformanceReview" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "PerformanceReview_employeeId_idx" ON "PerformanceReview" ("employeeId");
CREATE INDEX IF NOT EXISTS "PerformanceReview_candidateId_idx" ON "PerformanceReview" ("candidateId");
CREATE INDEX IF NOT EXISTS "PerformanceReview_departmentId_idx" ON "PerformanceReview" ("departmentId");
CREATE INDEX IF NOT EXISTS "PerformanceReview_stage_idx" ON "PerformanceReview" ("stage");


CREATE TABLE IF NOT EXISTS "PerformanceGoal" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "PerformanceGoal_tenantId_recordKey_key" ON "PerformanceGoal" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "PerformanceGoal_tenantId_workspaceId_idx" ON "PerformanceGoal" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "PerformanceGoal_tenantId_status_idx" ON "PerformanceGoal" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "PerformanceGoal_employeeId_idx" ON "PerformanceGoal" ("employeeId");
CREATE INDEX IF NOT EXISTS "PerformanceGoal_candidateId_idx" ON "PerformanceGoal" ("candidateId");
CREATE INDEX IF NOT EXISTS "PerformanceGoal_departmentId_idx" ON "PerformanceGoal" ("departmentId");
CREATE INDEX IF NOT EXISTS "PerformanceGoal_stage_idx" ON "PerformanceGoal" ("stage");


CREATE TABLE IF NOT EXISTS "PerformanceCycle" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "PerformanceCycle_tenantId_recordKey_key" ON "PerformanceCycle" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "PerformanceCycle_tenantId_workspaceId_idx" ON "PerformanceCycle" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "PerformanceCycle_tenantId_status_idx" ON "PerformanceCycle" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "PerformanceCycle_employeeId_idx" ON "PerformanceCycle" ("employeeId");
CREATE INDEX IF NOT EXISTS "PerformanceCycle_candidateId_idx" ON "PerformanceCycle" ("candidateId");
CREATE INDEX IF NOT EXISTS "PerformanceCycle_departmentId_idx" ON "PerformanceCycle" ("departmentId");
CREATE INDEX IF NOT EXISTS "PerformanceCycle_stage_idx" ON "PerformanceCycle" ("stage");


CREATE TABLE IF NOT EXISTS "FeedbackRecord" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "FeedbackRecord_tenantId_recordKey_key" ON "FeedbackRecord" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "FeedbackRecord_tenantId_workspaceId_idx" ON "FeedbackRecord" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "FeedbackRecord_tenantId_status_idx" ON "FeedbackRecord" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "FeedbackRecord_employeeId_idx" ON "FeedbackRecord" ("employeeId");
CREATE INDEX IF NOT EXISTS "FeedbackRecord_candidateId_idx" ON "FeedbackRecord" ("candidateId");
CREATE INDEX IF NOT EXISTS "FeedbackRecord_departmentId_idx" ON "FeedbackRecord" ("departmentId");
CREATE INDEX IF NOT EXISTS "FeedbackRecord_stage_idx" ON "FeedbackRecord" ("stage");


CREATE TABLE IF NOT EXISTS "DevelopmentPlan" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "DevelopmentPlan_tenantId_recordKey_key" ON "DevelopmentPlan" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "DevelopmentPlan_tenantId_workspaceId_idx" ON "DevelopmentPlan" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "DevelopmentPlan_tenantId_status_idx" ON "DevelopmentPlan" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "DevelopmentPlan_employeeId_idx" ON "DevelopmentPlan" ("employeeId");
CREATE INDEX IF NOT EXISTS "DevelopmentPlan_candidateId_idx" ON "DevelopmentPlan" ("candidateId");
CREATE INDEX IF NOT EXISTS "DevelopmentPlan_departmentId_idx" ON "DevelopmentPlan" ("departmentId");
CREATE INDEX IF NOT EXISTS "DevelopmentPlan_stage_idx" ON "DevelopmentPlan" ("stage");


CREATE TABLE IF NOT EXISTS "CompetencyAssessment" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "CompetencyAssessment_tenantId_recordKey_key" ON "CompetencyAssessment" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "CompetencyAssessment_tenantId_workspaceId_idx" ON "CompetencyAssessment" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "CompetencyAssessment_tenantId_status_idx" ON "CompetencyAssessment" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "CompetencyAssessment_employeeId_idx" ON "CompetencyAssessment" ("employeeId");
CREATE INDEX IF NOT EXISTS "CompetencyAssessment_candidateId_idx" ON "CompetencyAssessment" ("candidateId");
CREATE INDEX IF NOT EXISTS "CompetencyAssessment_departmentId_idx" ON "CompetencyAssessment" ("departmentId");
CREATE INDEX IF NOT EXISTS "CompetencyAssessment_stage_idx" ON "CompetencyAssessment" ("stage");


CREATE TABLE IF NOT EXISTS "Course" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "Course_tenantId_recordKey_key" ON "Course" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "Course_tenantId_workspaceId_idx" ON "Course" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "Course_tenantId_status_idx" ON "Course" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "Course_employeeId_idx" ON "Course" ("employeeId");
CREATE INDEX IF NOT EXISTS "Course_candidateId_idx" ON "Course" ("candidateId");
CREATE INDEX IF NOT EXISTS "Course_departmentId_idx" ON "Course" ("departmentId");
CREATE INDEX IF NOT EXISTS "Course_stage_idx" ON "Course" ("stage");


CREATE TABLE IF NOT EXISTS "LearningPath" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "LearningPath_tenantId_recordKey_key" ON "LearningPath" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "LearningPath_tenantId_workspaceId_idx" ON "LearningPath" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "LearningPath_tenantId_status_idx" ON "LearningPath" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "LearningPath_employeeId_idx" ON "LearningPath" ("employeeId");
CREATE INDEX IF NOT EXISTS "LearningPath_candidateId_idx" ON "LearningPath" ("candidateId");
CREATE INDEX IF NOT EXISTS "LearningPath_departmentId_idx" ON "LearningPath" ("departmentId");
CREATE INDEX IF NOT EXISTS "LearningPath_stage_idx" ON "LearningPath" ("stage");


CREATE TABLE IF NOT EXISTS "Enrollment" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "Enrollment_tenantId_recordKey_key" ON "Enrollment" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "Enrollment_tenantId_workspaceId_idx" ON "Enrollment" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "Enrollment_tenantId_status_idx" ON "Enrollment" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "Enrollment_employeeId_idx" ON "Enrollment" ("employeeId");
CREATE INDEX IF NOT EXISTS "Enrollment_candidateId_idx" ON "Enrollment" ("candidateId");
CREATE INDEX IF NOT EXISTS "Enrollment_departmentId_idx" ON "Enrollment" ("departmentId");
CREATE INDEX IF NOT EXISTS "Enrollment_stage_idx" ON "Enrollment" ("stage");


CREATE TABLE IF NOT EXISTS "Assessment" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "Assessment_tenantId_recordKey_key" ON "Assessment" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "Assessment_tenantId_workspaceId_idx" ON "Assessment" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "Assessment_tenantId_status_idx" ON "Assessment" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "Assessment_employeeId_idx" ON "Assessment" ("employeeId");
CREATE INDEX IF NOT EXISTS "Assessment_candidateId_idx" ON "Assessment" ("candidateId");
CREATE INDEX IF NOT EXISTS "Assessment_departmentId_idx" ON "Assessment" ("departmentId");
CREATE INDEX IF NOT EXISTS "Assessment_stage_idx" ON "Assessment" ("stage");


CREATE TABLE IF NOT EXISTS "Certification" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "Certification_tenantId_recordKey_key" ON "Certification" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "Certification_tenantId_workspaceId_idx" ON "Certification" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "Certification_tenantId_status_idx" ON "Certification" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "Certification_employeeId_idx" ON "Certification" ("employeeId");
CREATE INDEX IF NOT EXISTS "Certification_candidateId_idx" ON "Certification" ("candidateId");
CREATE INDEX IF NOT EXISTS "Certification_departmentId_idx" ON "Certification" ("departmentId");
CREATE INDEX IF NOT EXISTS "Certification_stage_idx" ON "Certification" ("stage");


CREATE TABLE IF NOT EXISTS "SkillDevelopmentPlan" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "SkillDevelopmentPlan_tenantId_recordKey_key" ON "SkillDevelopmentPlan" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "SkillDevelopmentPlan_tenantId_workspaceId_idx" ON "SkillDevelopmentPlan" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "SkillDevelopmentPlan_tenantId_status_idx" ON "SkillDevelopmentPlan" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "SkillDevelopmentPlan_employeeId_idx" ON "SkillDevelopmentPlan" ("employeeId");
CREATE INDEX IF NOT EXISTS "SkillDevelopmentPlan_candidateId_idx" ON "SkillDevelopmentPlan" ("candidateId");
CREATE INDEX IF NOT EXISTS "SkillDevelopmentPlan_departmentId_idx" ON "SkillDevelopmentPlan" ("departmentId");
CREATE INDEX IF NOT EXISTS "SkillDevelopmentPlan_stage_idx" ON "SkillDevelopmentPlan" ("stage");


CREATE TABLE IF NOT EXISTS "CompensationPlan" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "CompensationPlan_tenantId_recordKey_key" ON "CompensationPlan" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "CompensationPlan_tenantId_workspaceId_idx" ON "CompensationPlan" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "CompensationPlan_tenantId_status_idx" ON "CompensationPlan" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "CompensationPlan_employeeId_idx" ON "CompensationPlan" ("employeeId");
CREATE INDEX IF NOT EXISTS "CompensationPlan_candidateId_idx" ON "CompensationPlan" ("candidateId");
CREATE INDEX IF NOT EXISTS "CompensationPlan_departmentId_idx" ON "CompensationPlan" ("departmentId");
CREATE INDEX IF NOT EXISTS "CompensationPlan_stage_idx" ON "CompensationPlan" ("stage");


CREATE TABLE IF NOT EXISTS "SalaryBand" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "SalaryBand_tenantId_recordKey_key" ON "SalaryBand" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "SalaryBand_tenantId_workspaceId_idx" ON "SalaryBand" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "SalaryBand_tenantId_status_idx" ON "SalaryBand" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "SalaryBand_employeeId_idx" ON "SalaryBand" ("employeeId");
CREATE INDEX IF NOT EXISTS "SalaryBand_candidateId_idx" ON "SalaryBand" ("candidateId");
CREATE INDEX IF NOT EXISTS "SalaryBand_departmentId_idx" ON "SalaryBand" ("departmentId");
CREATE INDEX IF NOT EXISTS "SalaryBand_stage_idx" ON "SalaryBand" ("stage");


CREATE TABLE IF NOT EXISTS "BonusPlan" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "BonusPlan_tenantId_recordKey_key" ON "BonusPlan" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "BonusPlan_tenantId_workspaceId_idx" ON "BonusPlan" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "BonusPlan_tenantId_status_idx" ON "BonusPlan" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "BonusPlan_employeeId_idx" ON "BonusPlan" ("employeeId");
CREATE INDEX IF NOT EXISTS "BonusPlan_candidateId_idx" ON "BonusPlan" ("candidateId");
CREATE INDEX IF NOT EXISTS "BonusPlan_departmentId_idx" ON "BonusPlan" ("departmentId");
CREATE INDEX IF NOT EXISTS "BonusPlan_stage_idx" ON "BonusPlan" ("stage");


CREATE TABLE IF NOT EXISTS "PromotionPlan" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "PromotionPlan_tenantId_recordKey_key" ON "PromotionPlan" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "PromotionPlan_tenantId_workspaceId_idx" ON "PromotionPlan" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "PromotionPlan_tenantId_status_idx" ON "PromotionPlan" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "PromotionPlan_employeeId_idx" ON "PromotionPlan" ("employeeId");
CREATE INDEX IF NOT EXISTS "PromotionPlan_candidateId_idx" ON "PromotionPlan" ("candidateId");
CREATE INDEX IF NOT EXISTS "PromotionPlan_departmentId_idx" ON "PromotionPlan" ("departmentId");
CREATE INDEX IF NOT EXISTS "PromotionPlan_stage_idx" ON "PromotionPlan" ("stage");


CREATE TABLE IF NOT EXISTS "CompensationHistory" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "CompensationHistory_tenantId_recordKey_key" ON "CompensationHistory" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "CompensationHistory_tenantId_workspaceId_idx" ON "CompensationHistory" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "CompensationHistory_tenantId_status_idx" ON "CompensationHistory" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "CompensationHistory_employeeId_idx" ON "CompensationHistory" ("employeeId");
CREATE INDEX IF NOT EXISTS "CompensationHistory_candidateId_idx" ON "CompensationHistory" ("candidateId");
CREATE INDEX IF NOT EXISTS "CompensationHistory_departmentId_idx" ON "CompensationHistory" ("departmentId");
CREATE INDEX IF NOT EXISTS "CompensationHistory_stage_idx" ON "CompensationHistory" ("stage");


CREATE TABLE IF NOT EXISTS "WorkforcePlan" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "WorkforcePlan_tenantId_recordKey_key" ON "WorkforcePlan" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "WorkforcePlan_tenantId_workspaceId_idx" ON "WorkforcePlan" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "WorkforcePlan_tenantId_status_idx" ON "WorkforcePlan" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "WorkforcePlan_employeeId_idx" ON "WorkforcePlan" ("employeeId");
CREATE INDEX IF NOT EXISTS "WorkforcePlan_candidateId_idx" ON "WorkforcePlan" ("candidateId");
CREATE INDEX IF NOT EXISTS "WorkforcePlan_departmentId_idx" ON "WorkforcePlan" ("departmentId");
CREATE INDEX IF NOT EXISTS "WorkforcePlan_stage_idx" ON "WorkforcePlan" ("stage");


CREATE TABLE IF NOT EXISTS "HeadcountForecast" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "HeadcountForecast_tenantId_recordKey_key" ON "HeadcountForecast" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "HeadcountForecast_tenantId_workspaceId_idx" ON "HeadcountForecast" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "HeadcountForecast_tenantId_status_idx" ON "HeadcountForecast" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "HeadcountForecast_employeeId_idx" ON "HeadcountForecast" ("employeeId");
CREATE INDEX IF NOT EXISTS "HeadcountForecast_candidateId_idx" ON "HeadcountForecast" ("candidateId");
CREATE INDEX IF NOT EXISTS "HeadcountForecast_departmentId_idx" ON "HeadcountForecast" ("departmentId");
CREATE INDEX IF NOT EXISTS "HeadcountForecast_stage_idx" ON "HeadcountForecast" ("stage");


CREATE TABLE IF NOT EXISTS "WorkforceCapacityForecast" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "WorkforceCapacityForecast_tenantId_recordKey_key" ON "WorkforceCapacityForecast" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "WorkforceCapacityForecast_tenantId_workspaceId_idx" ON "WorkforceCapacityForecast" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "WorkforceCapacityForecast_tenantId_status_idx" ON "WorkforceCapacityForecast" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "WorkforceCapacityForecast_employeeId_idx" ON "WorkforceCapacityForecast" ("employeeId");
CREATE INDEX IF NOT EXISTS "WorkforceCapacityForecast_candidateId_idx" ON "WorkforceCapacityForecast" ("candidateId");
CREATE INDEX IF NOT EXISTS "WorkforceCapacityForecast_departmentId_idx" ON "WorkforceCapacityForecast" ("departmentId");
CREATE INDEX IF NOT EXISTS "WorkforceCapacityForecast_stage_idx" ON "WorkforceCapacityForecast" ("stage");


CREATE TABLE IF NOT EXISTS "HiringForecast" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "HiringForecast_tenantId_recordKey_key" ON "HiringForecast" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "HiringForecast_tenantId_workspaceId_idx" ON "HiringForecast" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "HiringForecast_tenantId_status_idx" ON "HiringForecast" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "HiringForecast_employeeId_idx" ON "HiringForecast" ("employeeId");
CREATE INDEX IF NOT EXISTS "HiringForecast_candidateId_idx" ON "HiringForecast" ("candidateId");
CREATE INDEX IF NOT EXISTS "HiringForecast_departmentId_idx" ON "HiringForecast" ("departmentId");
CREATE INDEX IF NOT EXISTS "HiringForecast_stage_idx" ON "HiringForecast" ("stage");


CREATE TABLE IF NOT EXISTS "ResourceForecast" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "ResourceForecast_tenantId_recordKey_key" ON "ResourceForecast" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "ResourceForecast_tenantId_workspaceId_idx" ON "ResourceForecast" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "ResourceForecast_tenantId_status_idx" ON "ResourceForecast" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "ResourceForecast_employeeId_idx" ON "ResourceForecast" ("employeeId");
CREATE INDEX IF NOT EXISTS "ResourceForecast_candidateId_idx" ON "ResourceForecast" ("candidateId");
CREATE INDEX IF NOT EXISTS "ResourceForecast_departmentId_idx" ON "ResourceForecast" ("departmentId");
CREATE INDEX IF NOT EXISTS "ResourceForecast_stage_idx" ON "ResourceForecast" ("stage");


CREATE TABLE IF NOT EXISTS "TalentProfile" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "TalentProfile_tenantId_recordKey_key" ON "TalentProfile" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "TalentProfile_tenantId_workspaceId_idx" ON "TalentProfile" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "TalentProfile_tenantId_status_idx" ON "TalentProfile" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "TalentProfile_employeeId_idx" ON "TalentProfile" ("employeeId");
CREATE INDEX IF NOT EXISTS "TalentProfile_candidateId_idx" ON "TalentProfile" ("candidateId");
CREATE INDEX IF NOT EXISTS "TalentProfile_departmentId_idx" ON "TalentProfile" ("departmentId");
CREATE INDEX IF NOT EXISTS "TalentProfile_stage_idx" ON "TalentProfile" ("stage");


CREATE TABLE IF NOT EXISTS "TalentScore" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "TalentScore_tenantId_recordKey_key" ON "TalentScore" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "TalentScore_tenantId_workspaceId_idx" ON "TalentScore" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "TalentScore_tenantId_status_idx" ON "TalentScore" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "TalentScore_employeeId_idx" ON "TalentScore" ("employeeId");
CREATE INDEX IF NOT EXISTS "TalentScore_candidateId_idx" ON "TalentScore" ("candidateId");
CREATE INDEX IF NOT EXISTS "TalentScore_departmentId_idx" ON "TalentScore" ("departmentId");
CREATE INDEX IF NOT EXISTS "TalentScore_stage_idx" ON "TalentScore" ("stage");


CREATE TABLE IF NOT EXISTS "SuccessionPlan" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "SuccessionPlan_tenantId_recordKey_key" ON "SuccessionPlan" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "SuccessionPlan_tenantId_workspaceId_idx" ON "SuccessionPlan" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "SuccessionPlan_tenantId_status_idx" ON "SuccessionPlan" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "SuccessionPlan_employeeId_idx" ON "SuccessionPlan" ("employeeId");
CREATE INDEX IF NOT EXISTS "SuccessionPlan_candidateId_idx" ON "SuccessionPlan" ("candidateId");
CREATE INDEX IF NOT EXISTS "SuccessionPlan_departmentId_idx" ON "SuccessionPlan" ("departmentId");
CREATE INDEX IF NOT EXISTS "SuccessionPlan_stage_idx" ON "SuccessionPlan" ("stage");


CREATE TABLE IF NOT EXISTS "RetentionRisk" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "RetentionRisk_tenantId_recordKey_key" ON "RetentionRisk" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "RetentionRisk_tenantId_workspaceId_idx" ON "RetentionRisk" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "RetentionRisk_tenantId_status_idx" ON "RetentionRisk" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "RetentionRisk_employeeId_idx" ON "RetentionRisk" ("employeeId");
CREATE INDEX IF NOT EXISTS "RetentionRisk_candidateId_idx" ON "RetentionRisk" ("candidateId");
CREATE INDEX IF NOT EXISTS "RetentionRisk_departmentId_idx" ON "RetentionRisk" ("departmentId");
CREATE INDEX IF NOT EXISTS "RetentionRisk_stage_idx" ON "RetentionRisk" ("stage");


CREATE TABLE IF NOT EXISTS "LeadershipCandidate" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "LeadershipCandidate_tenantId_recordKey_key" ON "LeadershipCandidate" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "LeadershipCandidate_tenantId_workspaceId_idx" ON "LeadershipCandidate" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "LeadershipCandidate_tenantId_status_idx" ON "LeadershipCandidate" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "LeadershipCandidate_employeeId_idx" ON "LeadershipCandidate" ("employeeId");
CREATE INDEX IF NOT EXISTS "LeadershipCandidate_candidateId_idx" ON "LeadershipCandidate" ("candidateId");
CREATE INDEX IF NOT EXISTS "LeadershipCandidate_departmentId_idx" ON "LeadershipCandidate" ("departmentId");
CREATE INDEX IF NOT EXISTS "LeadershipCandidate_stage_idx" ON "LeadershipCandidate" ("stage");


CREATE TABLE IF NOT EXISTS "EmployeeDashboard" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "EmployeeDashboard_tenantId_recordKey_key" ON "EmployeeDashboard" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "EmployeeDashboard_tenantId_workspaceId_idx" ON "EmployeeDashboard" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "EmployeeDashboard_tenantId_status_idx" ON "EmployeeDashboard" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "EmployeeDashboard_employeeId_idx" ON "EmployeeDashboard" ("employeeId");
CREATE INDEX IF NOT EXISTS "EmployeeDashboard_candidateId_idx" ON "EmployeeDashboard" ("candidateId");
CREATE INDEX IF NOT EXISTS "EmployeeDashboard_departmentId_idx" ON "EmployeeDashboard" ("departmentId");
CREATE INDEX IF NOT EXISTS "EmployeeDashboard_stage_idx" ON "EmployeeDashboard" ("stage");


CREATE TABLE IF NOT EXISTS "CareerPath" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "CareerPath_tenantId_recordKey_key" ON "CareerPath" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "CareerPath_tenantId_workspaceId_idx" ON "CareerPath" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "CareerPath_tenantId_status_idx" ON "CareerPath" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "CareerPath_employeeId_idx" ON "CareerPath" ("employeeId");
CREATE INDEX IF NOT EXISTS "CareerPath_candidateId_idx" ON "CareerPath" ("candidateId");
CREATE INDEX IF NOT EXISTS "CareerPath_departmentId_idx" ON "CareerPath" ("departmentId");
CREATE INDEX IF NOT EXISTS "CareerPath_stage_idx" ON "CareerPath" ("stage");


CREATE TABLE IF NOT EXISTS "InternalOpportunity" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "InternalOpportunity_tenantId_recordKey_key" ON "InternalOpportunity" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "InternalOpportunity_tenantId_workspaceId_idx" ON "InternalOpportunity" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "InternalOpportunity_tenantId_status_idx" ON "InternalOpportunity" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "InternalOpportunity_employeeId_idx" ON "InternalOpportunity" ("employeeId");
CREATE INDEX IF NOT EXISTS "InternalOpportunity_candidateId_idx" ON "InternalOpportunity" ("candidateId");
CREATE INDEX IF NOT EXISTS "InternalOpportunity_departmentId_idx" ON "InternalOpportunity" ("departmentId");
CREATE INDEX IF NOT EXISTS "InternalOpportunity_stage_idx" ON "InternalOpportunity" ("stage");


CREATE TABLE IF NOT EXISTS "EmployeeFeedback" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "EmployeeFeedback_tenantId_recordKey_key" ON "EmployeeFeedback" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "EmployeeFeedback_tenantId_workspaceId_idx" ON "EmployeeFeedback" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "EmployeeFeedback_tenantId_status_idx" ON "EmployeeFeedback" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "EmployeeFeedback_employeeId_idx" ON "EmployeeFeedback" ("employeeId");
CREATE INDEX IF NOT EXISTS "EmployeeFeedback_candidateId_idx" ON "EmployeeFeedback" ("candidateId");
CREATE INDEX IF NOT EXISTS "EmployeeFeedback_departmentId_idx" ON "EmployeeFeedback" ("departmentId");
CREATE INDEX IF NOT EXISTS "EmployeeFeedback_stage_idx" ON "EmployeeFeedback" ("stage");


CREATE TABLE IF NOT EXISTS "EmployeeEngagement" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "EmployeeEngagement_tenantId_recordKey_key" ON "EmployeeEngagement" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "EmployeeEngagement_tenantId_workspaceId_idx" ON "EmployeeEngagement" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "EmployeeEngagement_tenantId_status_idx" ON "EmployeeEngagement" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "EmployeeEngagement_employeeId_idx" ON "EmployeeEngagement" ("employeeId");
CREATE INDEX IF NOT EXISTS "EmployeeEngagement_candidateId_idx" ON "EmployeeEngagement" ("candidateId");
CREATE INDEX IF NOT EXISTS "EmployeeEngagement_departmentId_idx" ON "EmployeeEngagement" ("departmentId");
CREATE INDEX IF NOT EXISTS "EmployeeEngagement_stage_idx" ON "EmployeeEngagement" ("stage");


CREATE TABLE IF NOT EXISTS "OrganizationStructure" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "OrganizationStructure_tenantId_recordKey_key" ON "OrganizationStructure" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "OrganizationStructure_tenantId_workspaceId_idx" ON "OrganizationStructure" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "OrganizationStructure_tenantId_status_idx" ON "OrganizationStructure" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "OrganizationStructure_employeeId_idx" ON "OrganizationStructure" ("employeeId");
CREATE INDEX IF NOT EXISTS "OrganizationStructure_candidateId_idx" ON "OrganizationStructure" ("candidateId");
CREATE INDEX IF NOT EXISTS "OrganizationStructure_departmentId_idx" ON "OrganizationStructure" ("departmentId");
CREATE INDEX IF NOT EXISTS "OrganizationStructure_stage_idx" ON "OrganizationStructure" ("stage");


CREATE TABLE IF NOT EXISTS "ReportingLine" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "ReportingLine_tenantId_recordKey_key" ON "ReportingLine" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "ReportingLine_tenantId_workspaceId_idx" ON "ReportingLine" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "ReportingLine_tenantId_status_idx" ON "ReportingLine" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "ReportingLine_employeeId_idx" ON "ReportingLine" ("employeeId");
CREATE INDEX IF NOT EXISTS "ReportingLine_candidateId_idx" ON "ReportingLine" ("candidateId");
CREATE INDEX IF NOT EXISTS "ReportingLine_departmentId_idx" ON "ReportingLine" ("departmentId");
CREATE INDEX IF NOT EXISTS "ReportingLine_stage_idx" ON "ReportingLine" ("stage");


CREATE TABLE IF NOT EXISTS "TeamAnalytics" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "TeamAnalytics_tenantId_recordKey_key" ON "TeamAnalytics" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "TeamAnalytics_tenantId_workspaceId_idx" ON "TeamAnalytics" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "TeamAnalytics_tenantId_status_idx" ON "TeamAnalytics" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "TeamAnalytics_employeeId_idx" ON "TeamAnalytics" ("employeeId");
CREATE INDEX IF NOT EXISTS "TeamAnalytics_candidateId_idx" ON "TeamAnalytics" ("candidateId");
CREATE INDEX IF NOT EXISTS "TeamAnalytics_departmentId_idx" ON "TeamAnalytics" ("departmentId");
CREATE INDEX IF NOT EXISTS "TeamAnalytics_stage_idx" ON "TeamAnalytics" ("stage");


CREATE TABLE IF NOT EXISTS "OrganizationInsight" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "OrganizationInsight_tenantId_recordKey_key" ON "OrganizationInsight" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "OrganizationInsight_tenantId_workspaceId_idx" ON "OrganizationInsight" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "OrganizationInsight_tenantId_status_idx" ON "OrganizationInsight" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "OrganizationInsight_employeeId_idx" ON "OrganizationInsight" ("employeeId");
CREATE INDEX IF NOT EXISTS "OrganizationInsight_candidateId_idx" ON "OrganizationInsight" ("candidateId");
CREATE INDEX IF NOT EXISTS "OrganizationInsight_departmentId_idx" ON "OrganizationInsight" ("departmentId");
CREATE INDEX IF NOT EXISTS "OrganizationInsight_stage_idx" ON "OrganizationInsight" ("stage");


CREATE TABLE IF NOT EXISTS "HrCopilotQuery" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "HrCopilotQuery_tenantId_recordKey_key" ON "HrCopilotQuery" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "HrCopilotQuery_tenantId_workspaceId_idx" ON "HrCopilotQuery" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "HrCopilotQuery_tenantId_status_idx" ON "HrCopilotQuery" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "HrCopilotQuery_employeeId_idx" ON "HrCopilotQuery" ("employeeId");
CREATE INDEX IF NOT EXISTS "HrCopilotQuery_candidateId_idx" ON "HrCopilotQuery" ("candidateId");
CREATE INDEX IF NOT EXISTS "HrCopilotQuery_departmentId_idx" ON "HrCopilotQuery" ("departmentId");
CREATE INDEX IF NOT EXISTS "HrCopilotQuery_stage_idx" ON "HrCopilotQuery" ("stage");


CREATE TABLE IF NOT EXISTS "HrRecommendation" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "workspaceId" UUID,
  "recordKey" TEXT NOT NULL,
  "employeeId" UUID,
  "subjectEmployeeId" UUID,
  "userId" UUID,
  "departmentId" UUID,
  "managerEmployeeId" UUID,
  "candidateId" UUID,
  "jobRequisitionId" UUID,
  "jobPostingId" UUID,
  "courseId" UUID,
  "cycleId" UUID,
  "planId" UUID,
  "teamId" UUID,
  "relatedEntityType" TEXT,
  "relatedEntityId" TEXT,
  "name" TEXT,
  "title" TEXT,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "category" TEXT,
  "stage" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "countryCode" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "amount" DECIMAL(18,4) NOT NULL DEFAULT 0,
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "riskLevel" TEXT,
  "effectiveAt" TIMESTAMP(3),
  "startAt" TIMESTAMP(3),
  "endAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "metrics" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "recommendations" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdByUserId" UUID,
  "approvedByUserId" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
CREATE UNIQUE INDEX IF NOT EXISTS "HrRecommendation_tenantId_recordKey_key" ON "HrRecommendation" ("tenantId", "recordKey");
CREATE INDEX IF NOT EXISTS "HrRecommendation_tenantId_workspaceId_idx" ON "HrRecommendation" ("tenantId", "workspaceId");
CREATE INDEX IF NOT EXISTS "HrRecommendation_tenantId_status_idx" ON "HrRecommendation" ("tenantId", "status");
CREATE INDEX IF NOT EXISTS "HrRecommendation_employeeId_idx" ON "HrRecommendation" ("employeeId");
CREATE INDEX IF NOT EXISTS "HrRecommendation_candidateId_idx" ON "HrRecommendation" ("candidateId");
CREATE INDEX IF NOT EXISTS "HrRecommendation_departmentId_idx" ON "HrRecommendation" ("departmentId");
CREATE INDEX IF NOT EXISTS "HrRecommendation_stage_idx" ON "HrRecommendation" ("stage");

