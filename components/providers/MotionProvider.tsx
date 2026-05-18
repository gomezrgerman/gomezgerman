'use client'

import { AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import RouteWipe from '@/components/ui/RouteWipe'

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <>
      <RouteWipe />
      <AnimatePresence mode="wait" initial={false}>
        <div key={pathname}>
          {children}
        </div>
      </AnimatePresence>
    </>
  )
}
