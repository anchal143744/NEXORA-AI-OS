export interface EventTopicContract {
  name: string;
  retentionDays: number;
  subscribers: string[];
}
