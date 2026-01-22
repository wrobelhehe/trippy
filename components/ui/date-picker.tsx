"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
})

export function formatDateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

type DatePickerProps = {
  id?: string
  name: string
  value?: Date
  onChange: (date?: Date) => void
  placeholder?: string
  disabled?: boolean
  buttonClassName?: string
}

export function DatePicker({
  id,
  name,
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  buttonClassName,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
            buttonClassName
          )}
        >
          {value ? dateFormatter.format(value) : placeholder}
          <ChevronDown className="size-4 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          captionLayout="dropdown"
          onSelect={(date) => {
            onChange(date)
            setOpen(false)
          }}
        />
      </PopoverContent>
      <input type="hidden" name={name} value={value ? formatDateInputValue(value) : ""} />
    </Popover>
  )
}
