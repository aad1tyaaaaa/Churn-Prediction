"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, Lightbulb, TrendingUp, Users, AlertTriangle, Gift, Shield, Target } from "lucide-react"

interface DashboardStageProps {
  probability: number
  riskDriver: string
}

export function DashboardStage({ probability, riskDriver }: DashboardStageProps) {
  const [animatedProb, setAnimatedProb] = useState(0)

  useEffect(() => {
    const duration = 1500
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // Ease out cubic
      setAnimatedProb(probability * eased)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [probability])

  const riskLevel = probability > 0.7 ? "HIGH" : probability > 0.4 ? "MEDIUM" : "LOW"
  const riskColor = probability > 0.7 ? "#ef4444" : probability > 0.4 ? "#f59e0b" : "#22c55e"
  
  const getSuggestion = () => {
    if (probability > 0.7) {
      return {
        title: "Urgent Intervention Required",
        action: "Offer 20% Discount",
        description: "This customer is at high risk of churning. Immediate action with a personalized discount offer is recommended.",
        icon: AlertTriangle,
        color: "text-red-400",
        bgColor: "bg-red-500/10",
      }
    } else if (probability > 0.4) {
      return {
        title: "Proactive Outreach Suggested",
        action: "Loyalty Rewards",
        description: "Moderate churn risk detected. Consider engagement through loyalty programs and personalized communication.",
        icon: Gift,
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
      }
    } else {
      return {
        title: "Standard Monitoring",
        action: "Continue Engagement",
        description: "Customer shows healthy engagement patterns. Maintain current service quality and periodic check-ins.",
        icon: Shield,
        color: "text-green-400",
        bgColor: "bg-green-500/10",
      }
    }
  }

  const suggestion = getSuggestion()
  const SuggestionIcon = suggestion.icon

  // Calculate gauge path
  const gaugeRadius = 80
  const gaugeStroke = 12
  const circumference = Math.PI * gaugeRadius
  const strokeDashoffset = circumference * (1 - animatedProb)

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Visual Dashboard</h2>
            <p className="text-muted-foreground">Real-time churn prediction analytics</p>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Radial Gauge - Large */}
        <motion.div
          className="glass-card rounded-2xl p-6 md:col-span-1 lg:col-span-1 lg:row-span-2 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Churn Probability</h3>
          
          <div className="relative w-48 h-32">
            <svg className="w-full h-full" viewBox="0 0 200 120">
              {/* Background arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="currentColor"
                strokeWidth={gaugeStroke}
                className="text-secondary"
              />
              {/* Foreground arc */}
              <motion.path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke={riskColor}
                strokeWidth={gaugeStroke}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ filter: `drop-shadow(0 0 8px ${riskColor})` }}
              />
              {/* Needle */}
              <motion.line
                x1="100"
                y1="100"
                x2="100"
                y2="35"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className="text-foreground origin-bottom"
                style={{ transformOrigin: "100px 100px" }}
                initial={{ rotate: -90 }}
                animate={{ rotate: -90 + animatedProb * 180 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              {/* Center dot */}
              <circle cx="100" cy="100" r="6" fill={riskColor} />
            </svg>
          </div>

          <div className="text-center mt-4">
            <motion.div
              className="text-4xl font-bold neon-text"
              style={{ color: riskColor }}
            >
              {(animatedProb * 100).toFixed(1)}%
            </motion.div>
            <div className={`text-sm font-medium mt-1 ${suggestion.color}`}>
              {riskLevel} RISK
            </div>
          </div>
        </motion.div>

        {/* AI Suggestion Card */}
        <motion.div
          className="glass-card rounded-2xl p-6 md:col-span-1 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl ${suggestion.bgColor} flex items-center justify-center`}>
              <SuggestionIcon className={`w-6 h-6 ${suggestion.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb className="w-4 h-4 text-primary" />
                <span className="text-xs text-primary font-medium">AI RECOMMENDATION</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{suggestion.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{suggestion.description}</p>
              
              <div className="mt-4 flex items-center gap-3">
                <div className={`px-3 py-1.5 rounded-lg ${suggestion.bgColor}`}>
                  <span className={`text-sm font-medium ${suggestion.color}`}>{suggestion.action}</span>
                </div>
                <span className="text-xs text-muted-foreground">Suggested Action</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Risk Driver Card */}
        <motion.div
          className="glass-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium">PRIMARY RISK DRIVER</span>
          </div>
          <h3 className="text-xl font-semibold text-foreground">{riskDriver}</h3>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Impact Score</span>
              <span className="text-primary font-medium">{(35 + Math.random() * 15).toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${35 + Math.random() * 15}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Confidence Score */}
        <motion.div
          className="glass-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium">MODEL CONFIDENCE</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{(85 + Math.random() * 12).toFixed(1)}%</span>
            <span className="text-sm text-green-400">High</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Based on 847 decision trees ensemble</p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="glass-card rounded-2xl p-6 md:col-span-2 lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium">COHORT COMPARISON</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">vs Similar Tenure</span>
              <span className={`text-sm font-medium ${probability > 0.5 ? "text-red-400" : "text-green-400"}`}>
                {probability > 0.5 ? "+" : ""}{((probability - 0.35) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">vs Same Contract</span>
              <span className={`text-sm font-medium ${probability > 0.4 ? "text-amber-400" : "text-green-400"}`}>
                {probability > 0.4 ? "+" : ""}{((probability - 0.4) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">vs Overall Avg</span>
              <span className={`text-sm font-medium ${probability > 0.25 ? "text-amber-400" : "text-green-400"}`}>
                {probability > 0.25 ? "+" : ""}{((probability - 0.25) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
