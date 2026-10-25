export function AiTypingIndicator() {
  return (
    <div className="flex items-center gap-1.5" aria-label="AI is typing">
      {[0, 1, 2].map((dot) => (
        <span key={dot} className="size-1.5 animate-soft-pulse rounded-full bg-gold-300" style={{ animationDelay: String(dot * 120) + 'ms' }} />
      ))}
    </div>
  );
}
