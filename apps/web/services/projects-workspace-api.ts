import { apiRequest } from '@/lib/api-client';
import type {
  CreateProjectPayload,
  CreateProjectTaskPayload,
  ProjectRecord,
  ProjectsWorkspaceData,
  ProjectTaskRecord,
  TaskStatus,
  UpdateProjectPayload,
} from '@/types/projects-workspace';

const base = '/v1/projects';

export const projectsWorkspaceApi = {
  async getWorkspace(): Promise<ProjectsWorkspaceData> {
    const [projects, tasks] = await Promise.all([
      apiRequest<ProjectRecord[]>(base),
      apiRequest<ProjectTaskRecord[]>(base + '/tasks'),
    ]);
    return { projects, tasks };
  },
  createProject: (payload: CreateProjectPayload) => apiRequest<ProjectRecord, CreateProjectPayload>(base, { method: 'POST', body: payload }),
  updateProject: (id: string, payload: UpdateProjectPayload) => apiRequest<ProjectRecord, UpdateProjectPayload>(base + '/' + id, { method: 'PATCH', body: payload }),
  createTask: (payload: CreateProjectTaskPayload) => apiRequest<ProjectTaskRecord, CreateProjectTaskPayload>(base + '/tasks', { method: 'POST', body: payload }),
  updateTaskStatus: (id: string, status: TaskStatus) => apiRequest<ProjectTaskRecord, { status: TaskStatus }>(base + '/tasks/' + id + '/status', { method: 'PATCH', body: { status } }),
};
