export type ProjectStatus = 'PLANNED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELED';
export type TaskStatus = string;
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface ProjectRecord {
  id: string;
  tenantId: string;
  workspaceId: string | null;
  teamId: string | null;
  name: string;
  status: ProjectStatus;
  startDate: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ProjectTaskRecord {
  id: string;
  tenantId: string;
  workspaceId: string | null;
  projectId: string | null;
  assigneeUserId: string | null;
  createdByUserId: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ProjectsWorkspaceData {
  projects: ProjectRecord[];
  tasks: ProjectTaskRecord[];
}

export interface CreateProjectPayload {
  name: string;
  startDate?: string;
  dueDate?: string;
}

export interface UpdateProjectPayload {
  name?: string;
  status?: ProjectStatus;
  dueDate?: string;
}

export interface CreateProjectTaskPayload {
  title: string;
  description?: string;
  projectId?: string;
  assigneeUserId?: string;
  priority?: TaskPriority;
  dueAt?: string;
}
