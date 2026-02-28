import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Container = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  )
})
Container.displayName = 'Container'
