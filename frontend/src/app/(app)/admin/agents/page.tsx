'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, CheckCircle2, Activity, ArrowRight, Zap, Radio, Cpu, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';
import { timeAgo } from '@/lib/utils';
import { ThreeDCard } from '@/components/ui/ThreeDCard';

const AGENT_ICONS: Record<string, string> = {
  prescription_vision: '👁️', geo_broadcast: '📡', pricing_copilot: '💰',
  compliance_audit: '🛡️', merchant_onboarding: '🏪', logistics_dispatch: '🚚',
  admin_analytics: '📊', orchestrator: '🧠',
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    api.get('/agents').then(r => setAgents(r.data)).catch(() => {});
    api.get('/agents/logs').then(r => setLogs(r.data)).catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-heading font-bold text-slate-100">AI Multi-Agent Command Mesh</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">Autonomous orchestration layer managing vision, geo-routing, reverse auctions, and safety</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0d1527] border border-cyan-500/20 px-3.5 py-1.5 rounded-full text-xs text-cyan-300">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Central Orchestrator Synchronized</span>
        </div>
      </div>

      {/* Workflow Visualization */}
      <ThreeDCard className="p-6">
        <h3 className="font-heading font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          End-to-End Autonomous Prescription Pipeline
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { name: '1. Vision OCR', role: 'Extracts Dr & Meds' },
            { name: '2. Geo-Broadcast', role: 'Finds 1-2km Pharmacies' },
            { name: '3. Pricing Co-Pilot', role: 'Analyzes Reverse Bids' },
            { name: '4. Compliance Guard', role: 'Audits Rx & Schedule H' },
            { name: '5. Logistics Dispatch', role: 'Coordinates Delivery' },
          ].map((step, i) => (
            <React.Fragment key={step.name}>
              <div className="px-3.5 py-2.5 bg-[#0d1527] border border-cyan-500/20 rounded-xl text-center min-w-[140px]">
                <p className="text-xs font-semibold text-cyan-300">{step.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{step.role}</p>
              </div>
              {i < 4 && <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </ThreeDCard>

      {/* Agent Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {agents.map((a, i) => (
          <ThreeDCard key={a.id} className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0d1527] border border-cyan-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                {AGENT_ICONS[a.agent_type] || '🤖'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-slate-100 text-sm">{a.name}</h4>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                    Online
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{a.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {a.tasks_completed} done
                  </span>
                  <span className="font-semibold text-cyan-300">{a.success_rate || 98.5}% accuracy</span>
                </div>
              </div>
            </div>
          </ThreeDCard>
        ))}
      </div>

      {/* Execution Logs */}
      <ThreeDCard className="p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1e293b]">
          <h3 className="font-heading font-semibold text-slate-100 flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            Live Agent Execution Telemetry
          </h3>
          <span className="text-xs text-slate-400">Real-time log trace</span>
        </div>
        {logs.length > 0 ? (
          <div className="divide-y divide-[#1e293b]/60 max-h-80 overflow-y-auto">
            {logs.map(l => (
              <div key={l.id} className="flex items-center justify-between py-3 px-2">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">{l.agent_name}</p>
                    <p className="text-xs text-slate-400 font-mono">{l.task_type}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-500">{timeAgo(l.created_at)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-sm text-slate-500">Autonomous telemetry is streaming in the background</div>
        )}
      </ThreeDCard>
    </div>
  );
}
