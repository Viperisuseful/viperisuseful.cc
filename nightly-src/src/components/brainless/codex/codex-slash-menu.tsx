"use client";

import * as React from "react";
import { CodexPrompt } from "@/components/brainless/codex/codex-prompt";
import { cn } from "@/lib/utils";

/**
 * CodexSlashMenu — Codex CLI's slash-command palette.
 *
 * Flat list under the `›` composer: padded command name + description.
 * Type after `/` to filter; arrow keys move the active row.
 */
export type CodexSlashCommand = { name: string; description: string };

const DEFAULT: CodexSlashCommand[] = [
  { name: "/model", description: "choose what model and reasoning effort to use" },
  { name: "/permissions", description: "choose what Codex is allowed to do" },
  { name: "/diff", description: "show the unified diff for this session" },
  { name: "/review", description: "review a pull request or local changes" },
  { name: "/status", description: "show model, limits, and session info" },
  { name: "/compact", description: "summarize the conversation to save context" },
];

const ACTIVE = "#ededed";
const INACTIVE = "#7a7a7a";
export function CodexSlashMenu({
  commands = DEFAULT,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSubmit,
  placeholder = "Type /help",
  model = "gpt-5.6-sol low",
  directory = "~/dev/brainless",
  disabled = false,
  className,
}: {
  commands?: CodexSlashCommand[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  model?: string;
  directory?: string;
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
  const clampedActive = list.length ? Math.min(active, list.length - 1) : 0;

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
      <CodexPrompt
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setActive(0);
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        mode="default"
        model={model}
        directory={directory}
      />

      {menuOpen && !disabled ? <ul
        role="listbox"
        aria-label="Slash commands"
        aria-activedescendant={
          list.length ? `codex-slash-${clampedActive}` : undefined
        }
        className="mt-2 max-h-56 space-y-0.5 overflow-y-auto pl-[2ch]"
      >
        {list.map((c, i) => {
          const activeRow = i === clampedActive;
          return (
            <li
              key={c.name}
              id={`codex-slash-${i}`}
              role="option"
              aria-selected={activeRow}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onSubmit?.(c.name)}
              className="grid cursor-pointer grid-cols-[minmax(7.5rem,10rem)_minmax(0,1fr)] gap-3"
              style={{ color: activeRow ? ACTIVE : INACTIVE }}
            >
              <span className="truncate">{c.name}</span>
              <span className="truncate">{c.description}</span>
            </li>
          );
        })}
      </ul> : null}
    </div>
  );
}
