"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface TimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function TimePicker({
  date,
  setDate,
  label = "Pick a time",
  className,
  disabled = false,
}: TimePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState<string>(() => {
    if (!date) return "";
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  });

  React.useEffect(() => {
    if (!date) {
      setSelectedTime("");
      return;
    }
    setSelectedTime(`${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`);
  }, [date]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
    
    if (!e.target.value || !date) return;
    
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setDate(newDate);
  };

  const handleTimeSelect = (hours: number, minutes: number) => {
    if (!date) {
      const now = new Date();
      now.setHours(hours);
      now.setMinutes(minutes);
      now.setSeconds(0);
      now.setMilliseconds(0);
      setDate(now);
    } else {
      const newDate = new Date(date);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      setDate(newDate);
    }
    setSelectedTime(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`);
  };

  // Generate time options in 30-minute intervals
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      timeOptions.push({
        label: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
        hours: hour,
        minutes: minute,
      });
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {selectedTime ? selectedTime : <span>{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 border-b">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={selectedTime}
            onChange={handleTimeChange}
            className="mt-1"
          />
        </div>
        <div className="py-2 max-h-60 overflow-y-auto">
          {timeOptions.map((time) => (
            <Button
              key={time.label}
              variant="ghost"
              className="w-full justify-start font-normal"
              onClick={() => handleTimeSelect(time.hours, time.minutes)}
            >
              {time.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
