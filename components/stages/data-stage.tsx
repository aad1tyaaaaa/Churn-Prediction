"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Database, ArrowRight, Sparkles } from "lucide-react"

interface DataStageProps {
  onComplete: () => void
  isCompleted: boolean
}

const rawData = [
  { id: 1, gender: "Male", contract: "Month-to-month", tenure: 12, charges: 75.5 },
  { id: 2, gender: "Female", contract: "Two year", tenure: 45, charges: 89.2 },
  { id: 3, gender: "Male", contract: "One year", tenure: 24, charges: 62.8 },
  { id: 4, gender: "Female", contract: "Month-to-month", tenure: 3, charges: 95.1 },
]

const encodedData = [
  [1, 0, 0, 1, 12, 75.5],
  [0, 0, 1, 0, 45, 89.2],
  [1, 1, 0, 0, 24, 62.8],
  [0, 0, 0, 1, 3, 95.1],
]

export function DataStage({ onComplete, isCompleted }: DataStageProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showEncoded, setShowEncoded] = useState(isCompleted)
  const cardsRef = useRef<HTMLDivElement>(null)
  const matrixRef = useRef<HTMLDivElement>(null)

  const handleProcess = () => {
    if (isProcessing) return
    setIsProcessing(true)

    // GSAP animation for cards
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll(".data-card")
      
      gsap.to(cards, {
        rotateY: 180,
        scale: 0.9,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.inOut",
        onComplete: () => {
          setShowEncoded(true)
          
          if (matrixRef.current) {
            const cells = matrixRef.current.querySelectorAll(".matrix-cell")
            gsap.fromTo(
              cells,
              { opacity: 0, scale: 0 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.3,
                stagger: 0.02,
                ease: "back.out(1.7)",
                onComplete: () => {
                  setIsProcessing(false)
                  onComplete()
                },
              }
            )
          }
        },
      })
    }
  }

  useEffect(() => {
    if (isCompleted) {
      setShowEncoded(true)
    }
  }, [isCompleted])

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Data Engineering</h2>
            <p className="text-muted-foreground">Transform raw CSV data into ML-ready features</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 items-start">
        {/* Raw Data Cards */}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Raw Customer Data
          </h3>
          
          <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rawData.map((row, index) => (
              <motion.div
                key={row.id}
                className="data-card glass-card rounded-xl p-4 preserve-3d"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="text-xs text-muted-foreground mb-3">Customer #{row.id}</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gender</span>
                    <span className="text-foreground font-mono">{row.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contract</span>
                    <span className="text-foreground font-mono text-xs">{row.contract}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tenure</span>
                    <span className="text-foreground font-mono">{row.tenure} mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Charges</span>
                    <span className="text-primary font-mono">${row.charges}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div className="hidden lg:flex flex-col items-center justify-center self-center">
          <motion.div
            animate={isProcessing ? { x: [0, 10, 0] } : {}}
            transition={{ duration: 0.5, repeat: isProcessing ? Infinity : 0 }}
          >
            <ArrowRight className="w-8 h-8 text-primary" />
          </motion.div>
        </div>

        {/* Encoded Matrix */}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Encoded Feature Matrix
          </h3>

          <div className="glass-card rounded-xl p-4">
            {/* Header */}
            <div className="flex gap-2 mb-3 text-xs text-muted-foreground font-mono">
              <span className="w-8 text-center">M</span>
              <span className="w-8 text-center">1Y</span>
              <span className="w-8 text-center">2Y</span>
              <span className="w-8 text-center">MM</span>
              <span className="w-10 text-center">Ten</span>
              <span className="w-12 text-center">Chg</span>
            </div>

            {/* Matrix */}
            <div ref={matrixRef} className="space-y-2">
              <AnimatePresence>
                {showEncoded ? (
                  encodedData.map((row, rowIndex) => (
                    <motion.div
                      key={rowIndex}
                      className="flex gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {row.map((cell, cellIndex) => (
                        <div
                          key={cellIndex}
                          className={`matrix-cell ${cellIndex < 4 ? "w-8" : cellIndex === 4 ? "w-10" : "w-12"} h-8 rounded-md flex items-center justify-center text-xs font-mono
                            ${cell === 1 ? "bg-primary/30 text-primary" : cell === 0 ? "bg-secondary text-muted-foreground" : "bg-accent/20 text-accent"}`}
                        >
                          {typeof cell === "number" && cell % 1 !== 0 ? cell.toFixed(1) : cell}
                        </div>
                      ))}
                    </motion.div>
                  ))
                ) : (
                  <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
                    Process data to generate matrix
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Process Button */}
      <div className="mt-6 flex justify-center">
        <Button
          size="lg"
          onClick={handleProcess}
          disabled={isProcessing || isCompleted}
          className="relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl neon-glow"
        >
          {isProcessing ? (
            <>
              <Sparkles className="w-5 h-5 mr-2 animate-spin" />
              Encoding Features...
            </>
          ) : isCompleted ? (
            <>
              <Database className="w-5 h-5 mr-2" />
              Data Processed
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Process Data
            </>
          )}
          
          {isProcessing && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </Button>
      </div>
    </div>
  )
}
