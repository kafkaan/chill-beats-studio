import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export interface BgOption { src: string; label: string }

export default function BackgroundPicker({ options, value, onChange }: { options: BgOption[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="absolute right-4 top-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="soft">Arrière-plan</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Choisir une image</DropdownMenuLabel>
          {options.map((opt) => (
            <DropdownMenuItem key={opt.label} onClick={() => onChange(opt.src)}>
              <div className="flex items-center gap-3">
                <img src={opt.src} alt={opt.label} className="h-10 w-16 object-cover rounded" />
                <span className="truncate">{opt.label}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
