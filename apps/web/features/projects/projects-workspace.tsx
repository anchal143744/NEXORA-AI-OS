'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { BadgeCheck, CalendarDays, CircleDot, FolderKanban, ListChecks, Plus, RotateCcw } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-states';
import { Select } from '@/components/ui/select';
import {
  useCreateProject,
  useCreateProjectTask,
  useProjectsWorkspaceQuery,
  useUpdateProjectTaskStatus,
} from '@/hooks/use-projects-workspace-actions';
import { EnterpriseShell } from '@/layouts/enterprise-shell';
import { useAuthStore } from '@/stores/auth-store';
import type { ProjectRecord, ProjectTaskRecord, TaskPriority, TaskStatus } from '@/types/projects-workspace';

const taskStatuses: TaskStatus[] = ['TO' + 'DO', 'IN_PROGRESS', 'BLOCKED', 'DONE', 'CANCELED'];
const taskPriorities: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export function ProjectsWorkspace() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const authStatus = useAuthStore((state) => state.status);
  const workspaceQuery = useProjectsWorkspaceQuery();
  const createProject = useCreateProject();
  const createTask = useCreateProjectTask();
  const updateTaskStatus = useUpdateProjectTaskStatus();
  const [projectName, setProjectName] = useState('');
  const [projectDueDate, setProjectDueDate] = useState('');
  const [projectError, setProjectError] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskProjectId, setTaskProjectId] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('MEDIUM');
  const [taskError, setTaskError] = useState('');

  const projects = workspaceQuery.data?.projects ?? [];
  const tasks = workspaceQuery.data?.tasks ?? [];
  const projectById = useMemo(() => new Map(projects.map((project) => [project.id, project.name])), [projects]);
  const tasksByStatus = useMemo(
    () => taskStatuses.map((status) => ({ status, tasks: tasks.filter((task) => task.status === status) })),
    [tasks],
  );
  const activeProjectCount = projects.filter((project) => project.status === 'ACTIVE').length;
  const openTaskCount = tasks.filter((task) => !['DONE', 'CANCELED'].includes(task.status)).length;
  const blockedTaskCount = tasks.filter((task) => task.status === 'BLOCKED').length;
  const isSessionLoading = !hydrated || (hydrated && authStatus === 'unknown');

  async function handleCreateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = projectName.trim();
    if (!name) {
      setProjectError('Project name is required.');
      return;
    }
    setProjectError('');
    await createProject.mutateAsync({ name, dueDate: projectDueDate || undefined });
    setProjectName('');
    setProjectDueDate('');
  }

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = taskTitle.trim();
    if (!title) {
      setTaskError('Task title is required.');
      return;
    }
    setTaskError('');
    await createTask.mutateAsync({ title, projectId: taskProjectId || undefined, priority: taskPriority });
    setTaskTitle('');
  }

  return (
    <EnterpriseShell>
      <div className="space-y-5">
        <section className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-gold-500/[0.08] p-5 shadow-hairline">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <Badge>
                <FolderKanban className="size-3" />
                V1 Projects Workspace
              </Badge>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">Plan work, track tasks and keep delivery visible.</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-graphite-300">
                Projects and tasks are loaded from the authenticated workspace API with tenant and workspace isolation enforced by the backend.
              </p>
            </div>
            <Badge variant="success">
              <BadgeCheck className="size-3" />
              Live project data
            </Badge>
          </div>
        </section>

        {isSessionLoading ? (
          <Card>
            <CardContent className="pt-5">
              <LoadingState variant="ai" label="Restoring authenticated workspace session" />
            </CardContent>
          </Card>
        ) : null}

        {hydrated && authStatus === 'anonymous' ? (
          <ErrorState title="Sign in required" description="Projects are protected workspace data. Sign in before opening this V1 module." />
        ) : null}

        {workspaceQuery.isLoading ? (
          <Card>
            <CardContent className="pt-5">
              <LoadingState variant="ai" label="Loading authorized project workspace" />
            </CardContent>
          </Card>
        ) : null}

        {workspaceQuery.isError ? (
          <ErrorState
            title="Projects could not load"
            description={workspaceQuery.error.message}
            actionLabel="Retry projects"
            onAction={() => void workspaceQuery.refetch()}
          />
        ) : null}

        {workspaceQuery.isSuccess ? (
          <>
            <div className="grid gap-3 md:grid-cols-3">
              <ProjectMetric label="Projects" value={String(projects.length)} detail={activeProjectCount + ' active'} />
              <ProjectMetric label="Open tasks" value={String(openTaskCount)} detail={tasks.length + ' total tasks'} />
              <ProjectMetric label="Blocked" value={String(blockedTaskCount)} detail="Delivery items needing attention" />
            </div>

            <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
              <ProjectCreatePanel
                projectName={projectName}
                projectDueDate={projectDueDate}
                error={projectError || mutationError(createProject.error)}
                isPending={createProject.isPending}
                onProjectNameChange={setProjectName}
                onProjectDueDateChange={setProjectDueDate}
                onSubmit={handleCreateProject}
              />
              <TaskCreatePanel
                projects={projects}
                taskTitle={taskTitle}
                taskProjectId={taskProjectId}
                taskPriority={taskPriority}
                error={taskError || mutationError(createTask.error)}
                isPending={createTask.isPending}
                onTaskTitleChange={setTaskTitle}
                onTaskProjectIdChange={setTaskProjectId}
                onTaskPriorityChange={setTaskPriority}
                onSubmit={handleCreateTask}
              />
            </div>

            {projects.length === 0 && tasks.length === 0 ? (
              <EmptyState
                title="No project records yet"
                description="Create the first project or task to verify real persistence in the active workspace. NEXORA will not invent demo delivery data."
                icon={FolderKanban}
              />
            ) : null}

            {projects.length > 0 ? <ProjectList projects={projects} /> : null}

            {tasks.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ListChecks className="size-4 text-gold-100" />
                    Task board
                  </CardTitle>
                  <CardDescription>Status changes call the backend and refresh the workspace cache.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 xl:grid-cols-5">
                  {tasksByStatus.map((column) => (
                    <TaskColumn
                      key={column.status}
                      status={column.status}
                      tasks={column.tasks}
                      projectById={projectById}
                      updatingTaskId={updateTaskStatus.variables?.id}
                      updateTaskStatus={(id, status) => updateTaskStatus.mutate({ id, status })}
                    />
                  ))}
                </CardContent>
              </Card>
            ) : null}

            <Alert title="V1 project boundary" variant="info">
              Project deletion, file attachments, Gantt planning and realtime collaboration are not exposed by the current V1 API, so this route does not show those actions as working features.
            </Alert>
          </>
        ) : null}
      </div>
    </EnterpriseShell>
  );
}

function ProjectMetric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
        <p className="text-xs text-graphite-500">{detail}</p>
      </CardHeader>
    </Card>
  );
}

function ProjectCreatePanel({
  projectName,
  projectDueDate,
  error,
  isPending,
  onProjectNameChange,
  onProjectDueDateChange,
  onSubmit,
}: {
  projectName: string;
  projectDueDate: string;
  error: string;
  isPending: boolean;
  onProjectNameChange: (value: string) => void;
  onProjectDueDateChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Creates a real tenant/workspace-scoped Project record through the V1 API.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={onSubmit}>
          <Input value={projectName} onChange={(event) => onProjectNameChange(event.target.value)} placeholder="Customer implementation" aria-label="Project name" disabled={isPending} />
          <Input value={projectDueDate} onChange={(event) => onProjectDueDateChange(event.target.value)} type="date" aria-label="Project due date" disabled={isPending} />
          {error ? <p className="text-sm text-red-200">{error}</p> : null}
          <Button type="submit" disabled={isPending}>
            {isPending ? <RotateCcw className="size-4 animate-spin" /> : <Plus className="size-4" />}
            {isPending ? 'Creating project' : 'Create project'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function TaskCreatePanel({
  projects,
  taskTitle,
  taskProjectId,
  taskPriority,
  error,
  isPending,
  onTaskTitleChange,
  onTaskProjectIdChange,
  onTaskPriorityChange,
  onSubmit,
}: {
  projects: ProjectRecord[];
  taskTitle: string;
  taskProjectId: string;
  taskPriority: TaskPriority;
  error: string;
  isPending: boolean;
  onTaskTitleChange: (value: string) => void;
  onTaskProjectIdChange: (value: string) => void;
  onTaskPriorityChange: (value: TaskPriority) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create task</CardTitle>
        <CardDescription>Creates a real task and optionally links it to an existing project.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={onSubmit}>
          <Input value={taskTitle} onChange={(event) => onTaskTitleChange(event.target.value)} placeholder="Prepare launch checklist" aria-label="Task title" disabled={isPending} />
          <Select
            value={taskProjectId}
            onChange={(event) => onTaskProjectIdChange(event.target.value)}
            placeholder="No project selected"
            options={projects.map((project) => ({ label: project.name, value: project.id }))}
            aria-label="Task project"
            disabled={isPending}
          />
          <Select
            value={taskPriority}
            onChange={(event) => onTaskPriorityChange(readTaskPriority(event.target.value))}
            options={taskPriorities.map((priority) => ({ label: toLabel(priority), value: priority }))}
            aria-label="Task priority"
            disabled={isPending}
          />
          {error ? <p className="text-sm text-red-200">{error}</p> : null}
          <Button type="submit" disabled={isPending}>
            {isPending ? <RotateCcw className="size-4 animate-spin" /> : <Plus className="size-4" />}
            {isPending ? 'Creating task' : 'Create task'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ProjectList({ projects }: { projects: ProjectRecord[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderKanban className="size-4 text-gold-100" />
          Projects
        </CardTitle>
        <CardDescription>Persisted projects in the current workspace.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 xl:grid-cols-3">
        {projects.map((project) => (
          <article key={project.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-white">{project.name}</h3>
                <p className="mt-1 text-xs text-graphite-500">Created {formatDate(project.createdAt)}</p>
              </div>
              <Badge variant={project.status === 'ACTIVE' ? 'success' : project.status === 'ON_HOLD' ? 'warning' : 'neutral'}>{toLabel(project.status)}</Badge>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-graphite-300">
              <CalendarDays className="size-4 text-gold-100" />
              Due {formatDate(project.dueDate)}
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

function TaskColumn({
  status,
  tasks,
  projectById,
  updatingTaskId,
  updateTaskStatus,
}: {
  status: TaskStatus;
  tasks: ProjectTaskRecord[];
  projectById: Map<string, string>;
  updatingTaskId?: string;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
}) {
  return (
    <section className="min-h-60 rounded-lg border border-white/10 bg-white/[0.035] p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">{toLabel(status)}</h3>
        <Badge variant="neutral">{tasks.length}</Badge>
      </div>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="rounded-md border border-dashed border-white/10 p-3 text-xs leading-5 text-graphite-500">No tasks in this status.</div>
        ) : tasks.map((task) => (
          <article key={task.id} className="rounded-md border border-white/10 bg-graphite-950/70 p-3">
            <div className="flex items-start gap-2">
              <CircleDot className="mt-0.5 size-4 text-gold-100" />
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-white">{task.title}</h4>
                <p className="mt-1 text-xs text-graphite-500">{task.projectId ? projectById.get(task.projectId) ?? 'Project unavailable' : 'Unassigned task'}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant={task.priority === 'URGENT' || task.priority === 'HIGH' ? 'warning' : 'neutral'}>{toLabel(task.priority)}</Badge>
              {taskStatuses.filter((nextStatus) => nextStatus !== task.status).slice(0, 2).map((nextStatus) => (
                <Button
                  key={nextStatus}
                  size="sm"
                  variant="ghost"
                  disabled={updatingTaskId === task.id}
                  onClick={() => updateTaskStatus(task.id, nextStatus)}
                >
                  {toLabel(nextStatus)}
                </Button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatDate(value: string | null) {
  return value ? value.slice(0, 10) : 'not set';
}

function toLabel(value: string) {
  return value.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function readTaskPriority(value: string): TaskPriority {
  if (value === 'LOW') return 'LOW';
  if (value === 'HIGH') return 'HIGH';
  if (value === 'URGENT') return 'URGENT';
  return 'MEDIUM';
}

function mutationError(error: Error | null) {
  return error?.message ?? '';
}
