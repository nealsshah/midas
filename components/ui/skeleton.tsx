import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-gray-900 animate-pulse", className)}
      style={{ animationDuration: '2.5s' }}
      {...props}
    />
  )
}

export { Skeleton } 