"use client"

import * as React from "react"
import { ChevronDown, Plus } from "lucide-react"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
})  { 
  const [activeTeam] = React.useState(teams[0]) // Keep only the first team as active

  return (
    <div className="flex items-center gap-2 p-2">
      <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
        <activeTeam.logo className="size-3" />
      </div>
      <span className="truncate font-semibold">{activeTeam.name}</span>
    </div>
  )
}
