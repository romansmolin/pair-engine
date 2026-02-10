"use client"

import * as React from "react"
import { motion, useInView, type Variants } from "motion/react"

type TimelineTag = "div" | "h1" | "h2" | "h3" | "p" | "span" | "button"

type TimelineContentProps<T extends TimelineTag = "div"> = {
  as?: T
  animationNum?: number
  timelineRef: React.RefObject<Element | null>
  customVariants?: Variants
  className?: string
  children: React.ReactNode
} & Omit<React.ComponentPropsWithoutRef<T>, "children" | "className">

const motionComponents = {
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
  button: motion.button,
} as const

export function TimelineContent<T extends TimelineTag = "div">({
  as = "div" as T,
  animationNum = 0,
  timelineRef,
  customVariants,
  className,
  children,
  ...props
}: TimelineContentProps<T>) {
  const isInView = useInView(timelineRef, { once: true, amount: 0.25 })
  const MotionComponent = motionComponents[as]

  return (
    <MotionComponent
      variants={customVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={animationNum}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  )
}
