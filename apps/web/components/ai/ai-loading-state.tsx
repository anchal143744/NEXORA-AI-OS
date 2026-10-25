import { AiAvatar } from './ai-avatar';
import { AiTypingIndicator } from './ai-typing-indicator';

export function AiLoadingState({ label = 'NEXORA is thinking' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gold-500/18 bg-gold-500/8 p-4 text-sm text-graphite-300" role="status">
      <AiAvatar />
      <div>
        <div className="font-medium text-white">{label}</div>
        <div className="mt-2"><AiTypingIndicator /></div>
      </div>
    </div>
  );
}
