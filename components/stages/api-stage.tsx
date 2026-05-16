"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Code2, Copy, Check, RefreshCw, Send } from "lucide-react"

interface ApiStageProps {
  probability: number
  riskDriver: string
  onComplete: () => void
  isCompleted: boolean
}

export function ApiStage({ probability, riskDriver, onComplete, isCompleted }: ApiStageProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showResponse, setShowResponse] = useState(isCompleted)
  const [copied, setCopied] = useState(false)
  const [responseKey, setResponseKey] = useState(0)

  const generateResponse = () => {
    setIsGenerating(true)
    setResponseKey((prev) => prev + 1)
    
    setTimeout(() => {
      setShowResponse(true)
      setIsGenerating(false)
      if (!isCompleted) {
        onComplete()
      }
    }, 1500)
  }

  const copyToClipboard = () => {
    const json = JSON.stringify(getResponseObject(), null, 2)
    navigator.clipboard.writeText(json)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getResponseObject = () => ({
    status: "success",
    timestamp: new Date().toISOString(),
    model_version: "xgboost-v2.1.0",
    prediction: {
      churn_probability: probability,
      churn_risk_level: probability > 0.7 ? "HIGH" : probability > 0.4 ? "MEDIUM" : "LOW",
      confidence_score: 0.85 + Math.random() * 0.12,
      primary_risk_driver: riskDriver,
    },
    feature_importance: {
      [riskDriver.toLowerCase().replace(/\s+/g, "_")]: 0.35 + Math.random() * 0.15,
      contract_type: 0.15 + Math.random() * 0.1,
      tenure_months: 0.12 + Math.random() * 0.08,
      total_charges: 0.1 + Math.random() * 0.08,
    },
    recommendation: {
      action: probability > 0.7 ? "URGENT_INTERVENTION" : probability > 0.4 ? "PROACTIVE_OUTREACH" : "STANDARD_MONITORING",
      suggested_offer: probability > 0.6 ? "20% discount on next 3 months" : "Loyalty reward points",
    },
  })

  useEffect(() => {
    if (isCompleted) {
      setShowResponse(true)
    }
  }, [isCompleted])

  const responseObj = getResponseObject()
  const riskLevel = probability > 0.7 ? "HIGH" : probability > 0.4 ? "MEDIUM" : "LOW"
  const riskColor = probability > 0.7 ? "text-red-400" : probability > 0.4 ? "text-amber-400" : "text-green-400"

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">API Response</h2>
            <p className="text-muted-foreground">Mock JSON payload from prediction endpoint</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Endpoint info */}
        <div className="glass-card rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">POST</span>
              <span className="font-mono text-sm text-foreground/80">/api/v1/predict/churn</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              200 OK
            </div>
          </div>
        </div>

        {/* JSON Response */}
        <div className="flex-1 glass-card rounded-xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-mono">response.json</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-8 px-2"
                disabled={!showResponse}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={generateResponse}
                className="h-8 px-2"
                disabled={isGenerating}
              >
                <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Code block */}
          <div className="flex-1 p-4 overflow-auto font-mono text-sm">
            <AnimatePresence mode="wait">
              {showResponse ? (
                <motion.pre
                  key={responseKey}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="whitespace-pre-wrap"
                >
                  <span className="text-muted-foreground">{"{"}</span>
                  {"\n"}
                  <span className="text-primary/80">  "status"</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-green-400">"success"</span>
                  <span className="text-muted-foreground">,</span>
                  {"\n"}
                  <span className="text-primary/80">  "prediction"</span>
                  <span className="text-muted-foreground">: {"{"}</span>
                  {"\n"}
                  <span className="text-primary/80">    "churn_probability"</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-amber-400">{probability.toFixed(4)}</span>
                  <span className="text-muted-foreground">,</span>
                  {"\n"}
                  <span className="text-primary/80">    "churn_risk_level"</span>
                  <span className="text-muted-foreground">: </span>
                  <span className={riskColor}>"{riskLevel}"</span>
                  <span className="text-muted-foreground">,</span>
                  {"\n"}
                  <span className="text-primary/80">    "confidence_score"</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-amber-400">{responseObj.prediction.confidence_score.toFixed(4)}</span>
                  <span className="text-muted-foreground">,</span>
                  {"\n"}
                  <span className="text-primary/80">    "primary_risk_driver"</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-green-400">"{riskDriver}"</span>
                  {"\n"}
                  <span className="text-muted-foreground">  {"}"}</span>
                  <span className="text-muted-foreground">,</span>
                  {"\n"}
                  <span className="text-primary/80">  "recommendation"</span>
                  <span className="text-muted-foreground">: {"{"}</span>
                  {"\n"}
                  <span className="text-primary/80">    "action"</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-green-400">"{responseObj.recommendation.action}"</span>
                  <span className="text-muted-foreground">,</span>
                  {"\n"}
                  <span className="text-primary/80">    "suggested_offer"</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-green-400">"{responseObj.recommendation.suggested_offer}"</span>
                  {"\n"}
                  <span className="text-muted-foreground">  {"}"}</span>
                  {"\n"}
                  <span className="text-muted-foreground">{"}"}</span>
                </motion.pre>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex items-center justify-center text-muted-foreground"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  ) : (
                    "Generate response to view payload"
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="mt-6 flex justify-center">
        <Button
          size="lg"
          onClick={generateResponse}
          disabled={isGenerating}
          className="relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl neon-glow"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Generating Response...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              {showResponse ? "Regenerate Response" : "Generate Response"}
            </>
          )}

          {isGenerating && (
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
