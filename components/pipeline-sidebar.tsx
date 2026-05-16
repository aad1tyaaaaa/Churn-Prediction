"use client"

import { motion } from "framer-motion"
import { Database, Brain, Code2, BarChart3, Check } from "lucide-react"

interface PipelineSidebarProps {
  currentStage: number
  completedStages: number[]
  onStageSelect: (stage: number) => void
}

const stages = [
  { id: 1, label: "Data Engineering", icon: Database },
  { id: 2, label: "Model Inference", icon: Brain },
  { id: 3, label: "API Response", icon: Code2 },
  { id: 4, label: "Visual Dashboard", icon: BarChart3 },
]

export function PipelineSidebar({ currentStage, completedStages, onStageSelect }: PipelineSidebarProps) {
  return (
    <aside className="w-72 h-full glass-card rounded-2xl p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-1">Pipeline Stages</h2>
        <p className="text-sm text-muted-foreground">Interactive ML workflow</p>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {stages.map((stage, index) => {
          const isActive = currentStage === stage.id
          const isCompleted = completedStages.includes(stage.id)
          const isAccessible = stage.id <= Math.max(...completedStages, 1)
          const Icon = stage.icon

          return (
            <div key={stage.id} className="relative">
              {/* Connector line */}
              {index < stages.length - 1 && (
                <div className="absolute left-6 top-14 w-0.5 h-8 bg-border">
                  <motion.div
                    className="w-full bg-primary"
                    initial={{ height: 0 }}
                    animate={{ height: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </div>
              )}

              <motion.button
                onClick={() => isAccessible && onStageSelect(stage.id)}
                disabled={!isAccessible}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300
                  ${isActive ? "glass neon-glow" : "hover:bg-secondary/50"}
                  ${!isAccessible ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                `}
                whileHover={isAccessible ? { scale: 1.02 } : {}}
                whileTap={isAccessible ? { scale: 0.98 } : {}}
              >
                {/* Step indicator */}
                <div
                  className={`
                    relative w-10 h-10 rounded-full flex items-center justify-center
                    ${isCompleted ? "bg-primary" : isActive ? "bg-primary/20 border-2 border-primary" : "bg-secondary border border-border"}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-primary-foreground" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  )}
                  
                  {/* Pulse animation for active */}
                  {isActive && !isCompleted && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Label */}
                <div className="flex-1 text-left">
                  <span className="text-xs text-muted-foreground">Stage {stage.id}</span>
                  <p className={`font-medium ${isActive ? "text-foreground neon-text" : "text-foreground/80"}`}>
                    {stage.label}
                  </p>
                </div>
              </motion.button>
            </div>
          )
        })}
      </nav>

      {/* Progress indicator */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-primary font-medium">{Math.round((completedStages.length / 4) * 100)}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${(completedStages.length / 4) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </aside>
  )
}
