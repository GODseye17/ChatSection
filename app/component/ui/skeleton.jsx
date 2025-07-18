import { cn } from "@/app/lib/utils"

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-800", className)}
      {...props}
    />
  )
}

export { Skeleton }