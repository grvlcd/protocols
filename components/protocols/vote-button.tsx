"use client";

interface VoteButtonProps {
  votes: number;
  userVote: number | null;
  onVote: (value: 1 | -1) => void;
  disabled?: boolean;
  loading?: boolean;
  size?: "sm" | "md";
}

export function VoteButton({
  votes,
  userVote,
  onVote,
  disabled,
  loading,
  size = "md",
}: VoteButtonProps) {
  const hasUpvoted = userVote === 1;
  const hasDownvoted = userVote === -1;

  const isSmall = size === "sm";
  const buttonSize = isSmall ? "h-4 w-4" : "h-5 w-5";
  const textSize = isSmall ? "text-[0.6rem]" : "text-xs";
  const containerSize = isSmall
    ? "text-[0.6rem] sm:text-[0.65rem]"
    : "text-[0.65rem] sm:text-[0.7rem]";
  const padding = isSmall ? "px-1.5 py-1" : "px-1.5 py-1 sm:px-2";

  return (
    <div
      className={`flex flex-col items-center justify-center gap-0.5 rounded-lg border bg-card ${padding} ${containerSize} shadow-sm ${
        disabled ? "opacity-50" : ""
      } ${loading ? "pointer-events-none" : ""}`}
      title={disabled ? "Log in to vote" : "Vote"}
    >
      <button
        type="button"
        onClick={() => onVote(1)}
        disabled={disabled || loading}
        className={`${buttonSize} rounded-full ${textSize} font-semibold leading-none transition disabled:cursor-not-allowed ${
          hasUpvoted
            ? "bg-primary text-primary-foreground"
            : "text-foreground hover:bg-muted"
        }`}
        aria-label="Upvote"
      >
        ▲
      </button>
      <span className="min-w-[1.5rem] text-center font-medium text-foreground">
        {votes}
      </span>
      <button
        type="button"
        onClick={() => onVote(-1)}
        disabled={disabled || loading}
        className={`${buttonSize} rounded-full ${textSize} font-semibold leading-none transition disabled:cursor-not-allowed ${
          hasDownvoted
            ? "bg-primary text-primary-foreground"
            : "text-foreground hover:bg-muted"
        }`}
        aria-label="Downvote"
      >
        ▼
      </button>
    </div>
  );
}
