"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PipelineSidebar } from "./pipeline-sidebar"
import { DataStage } from "./stages/data-stage"
import { InferenceStage } from "./stages/inference-stage"
import { ApiStage } from "./stages/api-stage"
import { DashboardStage } from "./stages/dashboard-stage"
import { Zap, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ChurnFlowDashboard() {
  const [currentStage, setCurrentStage] = useState(1)
  const [completedStages, setCompletedStages] = useState<number[]>([])
  const [probability, setProbability] = useState(0)
  const [riskDriver, setRiskDriver] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleStageComplete = useCallback((stage: number) => {
    setCompletedStages((prev) => {
      if (!prev.includes(stage)) {
        return [...prev, stage]
      }
      return prev
    })
  }, [])

  const handleInferenceComplete = useCallback((prob: number, driver: string) => {
    setProbability(prob)
    setRiskDriver(driver)
    handleStageComplete(2)
  }, [handleStageComplete])

  const handleApiComplete = useCallback(() => {
    handleStageComplete(3)
  }, [handleStageComplete])

  const handleStageSelect = (stage: number) => {
    setCurrentStage(stage)
    setSidebarOpen(false)
  }

  const renderStageContent = () => {
    switch (currentStage) {
      case 1:
        return (
          <DataStage
            onComplete={() => {
              handleStageComplete(1)
              setCurrentStage(2)
            }}
            isCompleted={completedStages.includes(1)}
          />
        )
      case 2:
        return (
          <InferenceStage
            onComplete={(prob, driver) => {
              handleInferenceComplete(prob, driver)
              setCurrentStage(3)
            }}
            isCompleted={completedStages.includes(2)}
          />
        )
      case 3:
        return (
          <ApiStage
            probability={probability}
            riskDriver={riskDriver}
            onComplete={() => {
              handleApiComplete()
              setCurrentStage(4)
            }}
            isCompleted={completedStages.includes(3)}
          />
        )
      case 4:
        return (
          <DashboardStage
            probability={probability}
            riskDriver={riskDriver}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="glass border-b border-border px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center neon-glow">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">ChurnFlow AI</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Intelligent Churn Prediction</p>
              </div>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {/* Desktop status */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-muted-foreground">System Online</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Stage {currentStage} of 4
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 flex flex-col lg:flex-row p-4 lg:p-6 gap-6 max-w-7xl mx-auto w-full">
          {/* Mobile sidebar overlay */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="fixed left-0 top-0 bottom-0 w-80 z-50 p-4 lg:hidden"
                >
                  <PipelineSidebar
                    currentStage={currentStage}
                    completedStages={completedStages}
                    onStageSelect={handleStageSelect}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Desktop sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <PipelineSidebar
                currentStage={currentStage}
                completedStages={completedStages}
                onStageSelect={handleStageSelect}
              />
            </div>
          </div>

          {/* Main view */}
          <main className="flex-1 glass-card rounded-2xl p-6 lg:p-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {renderStageContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* Footer */}
        <footer className="glass border-t border-border px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto text-xs text-muted-foreground">
            <span>ChurnFlow AI v2.1.0</span>
            <span className="hidden sm:inline">XGBoost Model | 847 Trees | 94.2% Accuracy</span>
            <span>{new Date().getFullYear()} ML Pipeline Demo</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
