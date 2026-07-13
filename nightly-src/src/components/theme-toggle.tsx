import { Moon } from "@phosphor-icons/react/Moon"
import { Sun } from "@phosphor-icons/react/Sun"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { applyTheme, getInitialTheme, type Theme } from "@/lib/theme"

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme())

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const nextTheme = theme === "dark" ? "light" : "dark"
  const label = `Use ${nextTheme} theme`

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={label}
          onClick={() => setTheme(nextTheme)}
          size="icon-lg"
          type="button"
          variant="ghost"
        >
          {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
