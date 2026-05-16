"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Brain, Play, Terminal } from "lucide-react"

interface InferenceStageProps {
  onComplete: (probability: number, riskDriver: string) => void
  isCompleted: boolean
}

const logMessages = [
  { text: "Initializing XGBoost runtime...", delay: 200 },
  { text: "Loading model.pkl from artifacts/", delay: 400 },
  { text: "Model loaded: 847 trees, max_depth=6", delay: 300 },
  { text: "Parsing feature matrix (4, 6)...", delay: 250 },
  { text: "Applying feature scaling...", delay: 200 },
  { text: "Running tree ensemble forward pass...", delay: 350 },
  { text: "Calculating leaf node contributions...", delay: 300 },
  { text: "Computing weight matrices...", delay: 400 },
  { text: "Aggregating prediction scores...", delay: 300 },
  { text: "Applying sigmoid transformation...", delay: 200 },
  { text: "Generating SHAP feature importance...", delay: 350 },
  { text: "Inference complete. Preparing response...", delay: 300 },
]

const riskDrivers = [
  "High Monthly Charges",
  "Short Tenure Period",
  "Month-to-Month Contract",
  "No Tech Support",
  "Multiple Service Lines",
  "Payment Method Risk",
]

export function InferenceStage({ onComplete, isCompleted }: InferenceStageProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [currentLogIndex, setCurrentLogIndex] = useState(-1)
  const terminalRef = useRef<HTMLDivElement>(null)

  const runInference = () => {
    if (isRunning) return
    setIsRunning(true)
    setLogs([])
    setCurrentLogIndex(0)
  }

  useEffect(() => {
    if (currentLogIndex >= 0 && currentLogIndex < logMessages.length) {
      const timer = setTimeout(() => {
        setLogs((prev) => [...prev, logMessages[currentLogIndex].text])
        setCurrentLogIndex((prev) => prev + 1)

        // Auto-scroll terminal
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight
        }
      }, logMessages[currentLogIndex].delay)

      return () => clearTimeout(timer)
    } else if (currentLogIndex >= logMessages.length) {
      // Inference complete
      setTimeout(() => {
        const probability = Math.random()
        const riskDriver = riskDrivers[Math.floor(Math.random() * riskDrivers.length)]
        setIsRunning(false)
        onComplete(probability, riskDriver)
      }, 500)
    }
  }, [currentLogIndex, onComplete])

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Model Inference</h2>
            <p className="text-muted-foreground">Execute XGBoost prediction pipeline</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        {/* Model Brain Visualization */}
        <div className="lg:w-1/3 flex flex-col items-center justify-center">
          <motion.div
            className="relative w-48 h-48 flex items-center justify-center"
            animate={isRunning ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
          >
            {/* Outer rings */}
            {[0, 1, 2].map((ring) => (
              <motion.div
                key={ring}
                className="absolute inset-0 rounded-full border border-primary/30"
                style={{
                  transform: `scale(${1 + ring * 0.2})`,
                }}
                animate={
                  isRunning
                    ? {
                        rotate: ring % 2 === 0 ? 360 : -360,
                        opacity: [0.3, 0.6, 0.3],
                      }
                    : {}
                }
                transition={{
                  duration: 3 + ring,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}

            {/* Brain icon container */}
            <div className={`glass-card w-32 h-32 rounded-full flex items-center justify-center ${isRunning ? "neon-glow" : ""}`}>
              <Brain className={`w-16 h-16 ${isRunning ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
            </div>

            {/* Particles when running */}
            {isRunning && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-primary"
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 0,
                    }}
                    animate={{
                      x: Math.cos((i * Math.PI * 2) / 8) * 100,
                      y: Math.sin((i * Math.PI * 2) / 8) * 100,
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </>
            )}
          </motion.div>

          <div className="mt-6 text-center">
            <h3 className="font-semibold text-foreground">XGBoost Classifier</h3>
            <p className="text-sm text-muted-foreground">v2.1.0 | 847 Trees</p>
          </div>
        </div>

        {/* Terminal */}
        <div className="lg:w-2/3 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-mono">inference.log</span>
          </div>

          <div
            ref={terminalRef}
            className="flex-1 glass-card rounded-xl p-4 font-mono text-sm overflow-auto min-h-[300px] max-h-[400px]"
          >
            <div className="space-y-1">
              {logs.length === 0 && !isRunning && (
                <div className="text-muted-foreground">
                  <span className="text-primary">$</span> Waiting for inference command...
                </div>
              )}

              {logs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-muted-foreground">[{String(index + 1).padStart(2, "0")}]</span>
                  <span
                    className={
                      log.includes("complete") || log.includes("loaded")
                        ? "text-green-400"
                        : log.includes("Error")
                          ? "text-red-400"
                          : "text-foreground/90"
                    }
                  >
                    {log}
                  </span>
                </motion.div>
              ))}

              {isRunning && currentLogIndex < logMessages.length && (
                <motion.div
                  className="flex items-center gap-2"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <span className="text-primary">{">"}</span>
                  <span className="cursor-blink text-foreground/70">Processing</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Run Button */}
      <div className="mt-6 flex justify-center">
        <Button
          size="lg"
          onClick={runInference}
          disabled={isRunning || isCompleted}
          className="relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl neon-glow"
        >
          {isRunning ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-5 h-5 mr-2" />
              </motion.div>
              Running Inference...
            </>
          ) : isCompleted ? (
            <>
              <Brain className="w-5 h-5 mr-2" />
              Inference Complete
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Run Inference
            </>
          )}

          {isRunning && (
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
