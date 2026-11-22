'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, CheckCircle2, AlertTriangle, XCircle, Clock, Activity, ArrowRight, Zap, Radio } from 'lucide-react';
import api from '@/lib/api';
import { timeAgo } from '@/lib/utils';

const AGENT_ICONS: Record<string, string> = {
  prescription_vision: '👁️', geo_broadcast: '📡', pricing_copilot: '💰',
  compliance_audit: '🛡️', merchant_onboarding: '🏪', logistics_dispatch: '🚚',
  admin_analytics: '📊', orchestrator: '🧠',
};
const STATUS_COLOR: Record<string, string> = {
  idle: 'bg-medibid-bg text-medibid-text-secondary', processing: 'bg-medibid-soft-blue text-medibid-brand',
  completed: 'bg-medibid-mint text-green-700', needs_review: 'bg-amber-50 text-amber-700', failed: 'bg-red-50 text-red-700',
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
      <div>
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-medibid-brand" />
          <h1 className="text-2xl font-heading font-bold text-medibid-text-primary">AI Agent Command Center</h1>
        </div>
        <p className="text-sm text-medibid-text-secondary mt-1">Monitor and manage all AI agents</p>
      </div>

      {/* Workflow Visualization */}
      <div className="bg-white rounded-2xl border border-medibid-border p-6">
        <h3 className="font-heading font-semibold text-medibid-text-primary mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-medibid-brand" />Agent Workflow Pipeline</h3>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {['Prescription Vision', 'Geo-Broadcast', 'Pricing Co-Pilot', 'Compliance', 'Logistics'].map((name, i) => (
            <React.Fragment key={name}>
              <div className="px-3 py-2 bg-medibid-soft-blue rounded-xl text-xs font-semibold text-medibid-brand text-center min-w-[100px]">{name}</div>
              {i < 4 && <ArrowRight className="w-4 h-4 text-medibid-border flex-shrink-0" />}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-3 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-medibid-lavender rounded-full text-xs font-semibold text-purple-700">
            <Zap className="w-3 h-3" /> Central Orchestrator coordinates all agents
          </div>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {agents.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl border border-medibid-border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-medibid-bg flex items-center justify-center text-2xl flex-shrink-0">
                {AGENT_ICONS[a.agent_type] || '🤖'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-medibid-text-primary text-sm">{a.name}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLOR[a.status] || STATUS_COLOR.idle}`}>{a.status}</span>
                </div>
                <p className="text-xs text-medibid-text-secondary mt-1 line-clamp-2">{a.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-medibid-text-secondary">
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-medibid-success" />{a.tasks_completed} done</span>
                  <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-medibid-error" />{a.tasks_failed} failed</span>
                  <span className="font-semibold text-medibid-text-primary">{a.success_rate}% rate</span>
                </div>
                {a.last_execution && <p className="text-xs text-medibid-text-secondary mt-1">Last run: {timeAgo(a.last_execution)}</p>}
              </div>
            </div>
          </motion.div>
        ))}
        {agents.length === 0 && (
          <div className="md:col-span-2 bg-white rounded-2xl border border-medibid-border p-10 text-center">
            <Bot className="w-12 h-12 text-medibid-border mx-auto mb-3" />
            <p className="text-sm text-medibid-text-secondary">AI agents will appear here once the backend is running</p>
          </div>
        )}
      </div>

      {/* Execution Logs */}
      <div className="bg-white rounded-2xl border border-medibid-border">
        <div className="px-6 py-4 border-b border-medibid-border"><h3 className="font-heading font-semibold text-medibid-text-primary flex items-center gap-2"><Radio className="w-4 h-4 text-medibid-brand" />Execution Logs</h3></div>
        {logs.length > 0 ? (
          <div className="divide-y divide-medibid-border max-h-80 overflow-y-auto">
            {logs.map(l => (
              <div key={l.id} className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${l.status === 'success' ? 'bg-medibid-success' : l.status === 'failed' ? 'bg-medibid-error' : 'bg-medibid-warning'}`} />
                  <div>
                    <p className="text-sm font-medium text-medibid-text-primary">{l.agent_name}</p>
                    <p className="text-xs text-medibid-text-secondary">{l.task_type}</p>
                  </div>
                </div>
                <div className="text-right text-xs text-medibid-text-secondary">
                  {l.execution_time_ms && <p>{l.execution_time_ms}ms</p>}
                  {l.created_at && <p>{timeAgo(l.created_at)}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-medibid-text-secondary">No execution logs yet. Process a prescription to see agent activity.</div>
        )}
      </div>
    </div>
  );
}

