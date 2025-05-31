import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/app/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-purple-600 text-white shadow hover:bg-purple-700",
        secondary: "border-transparent bg-gray-700 text-gray-100 hover:bg-gray-600",
        destructive: "border-transparent bg-red-600 text-white shadow hover:bg-red-700",
        outline: "border-gray-700 text-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }