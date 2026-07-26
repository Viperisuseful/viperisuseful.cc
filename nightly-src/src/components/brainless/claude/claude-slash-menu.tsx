"use client";

import * as React from "react";
import { ClaudePrompt } from "@/components/brainless/claude/claude-prompt";
import { cn } from "@/lib/utils";

/**
 * ClaudeSlashMenu — Claude Code's slash-command palette.
 *
 * The command list sits above the real ClaudePrompt composer. Typing after
 * `/` in that input filters by command-name prefix; arrow keys move the
 * active option. Active rows are light blue; inactive rows are gray. Both
 * keep the same fixed-width name column so selection never shifts text.
 */
export type SlashCommand = { name: string; description: string };

const DEFAULT: SlashCommand[] = [
  { name: "/agents", description: "Manage subagents for specialized tasks" },
  { name: "/clear", description: "Clear conversation history and free up context" },
  { name: "/compact", description: "Summarize the conversation to save context" },
  { name: "/init", description: "Initialize a CLAUDE.md with codebase docs" },
  { name: "/model", description: "Change the model for this session" },
  { name: "/review", description: "Review a pull request" },
];

const ACTIVE = "#afd7ff"; // 38;5;153
const INACTIVE = "#949494"; // 38;5;246

export function ClaudeSlashMenu({
  commands = DEFAULT,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSubmit,
  placeholder = "Type /help",
  disabled = false,
  className,
}: {
  commands?: SlashCommand[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [active, setActive] = React.useState(0);
  const value = valueProp ?? internalValue;
  const setValue = (next: string) => {
    if (disabled) return;
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const query = value.startsWith("/") ? value.slice(1) : value;
  const list = commands.filter((c) =>
    c.name.slice(1).toLowerCase().startsWith(query.toLowerCase()),
  );
  const menuOpen = value.startsWith("/");
  const clampedActive = list.length
    ? Math.min(active, list.length - 1)
    : 0;

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const selected = menuOpen && list.length ? list[clampedActive]?.name : value;
      if (selected?.trim()) onSubmit?.(selected.trim());
      return;
    }
    if (e.key === "Tab" && menuOpen && list.length) {
      e.preventDefault();
      const selected = list[clampedActive]?.name;
      if (selected) setValue(selected);
      return;
    }
    if (!menuOpen || !list.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % list.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + list.length) % list.length);
    }
  }

  return (
    <div className={cn("font-mono text-[13px] leading-[1.6]", className)}>
      {menuOpen && !disabled ? <ul
        role="listbox"
        aria-label="Slash commands"
        aria-activedescendant={
          list.length ? `slash-${clampedActive}` : undefined
        }
        className="mb-2 flex max-h-56 flex-col gap-0.5 overflow-y-auto"
      >
        {list.map((c, i) => {
          const activeRow = i === clampedActive;
          return (
            <li
              key={c.name}
              id={`slash-${i}`}
              role="option"
              aria-selected={activeRow}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onSubmit?.(c.name)}
              className="slash-command-option grid cursor-pointer grid-cols-[minmax(7.5rem,10rem)_minmax(0,1fr)] gap-3 px-1 py-0.5"
              style={{ color: activeRow ? ACTIVE : INACTIVE }}
            >
              <span className="truncate font-semibold">{c.name}</span>
              <span className="truncate">{c.description}</span>
            </li>
          );
        })}
      </ul> : null}

      <ClaudePrompt
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setActive(0);
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        mode="auto"
        effort={false}
      />
    </div>
  );
}
