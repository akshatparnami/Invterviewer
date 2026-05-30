import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-y rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-zinc-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-zinc-800 dark:bg-zinc-950",
        className,
      )}
      {...props}
    />
  );
}
