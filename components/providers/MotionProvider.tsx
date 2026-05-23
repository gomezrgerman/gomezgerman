'use client'

import RouteWipe from '@/components/ui/RouteWipe'

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RouteWipe />
      {children}
    </>
  )
}
