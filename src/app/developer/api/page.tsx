"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/realtera/GlassCard";
import {
  ArrowLeft,
  Key,
  Plus,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  Clock,
  Activity,
  Shield,
  Code,
  Webhook as WebhookIcon,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  MOCK_API_KEYS_LIST,
  MOCK_API_USAGE_LOGS,
  MOCK_WEBHOOKS,
  PERMISSION_DEFINITIONS,
  maskApiKey,
  type ApiKey,
  type ApiUsageLog,
  type Webhook,
} from "@/lib/mock/api-keys";

function ApiKeyCard({
  apiKey,
  onRevoke,
}: {
  apiKey: ApiKey;
  onRevoke: () => void;
}) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // In real app, would copy actual key
    navigator.clipboard.writeText(apiKey.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`rounded-lg p-2.5 ${
            apiKey.environment === "production"
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-amber-500/20 text-amber-400"
          }`}>
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-white">{apiKey.name}</h3>
            <p className="text-sm text-white/50">{apiKey.organizationName}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          apiKey.environment === "production"
            ? "bg-emerald-500/20 text-emerald-400"
            : "bg-amber-500/20 text-amber-400"
        }`}>
          {apiKey.environment}
        </span>
      </div>

      {/* Key Display */}
      <div className="mt-4 flex items-center gap-2">
        <code className="flex-1 rounded-lg bg-slate-800/50 px-3 py-2 font-mono text-sm text-white/80">
          {showKey ? `${apiKey.keyPrefix}_${apiKey.id.slice(-8)}` : maskApiKey(`${apiKey.keyPrefix}_${apiKey.id}`)}
        </code>
        <button
          onClick={() => setShowKey(!showKey)}
          className="p-2 rounded-lg hover:bg-white/10 text-white/60"
        >
          {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg hover:bg-white/10 text-white/60"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>

      {/* Permissions */}
      <div className="mt-4">
        <p className="text-xs text-white/40 mb-2">Permissions</p>
        <div className="flex flex-wrap gap-1">
          {apiKey.permissions.map((perm) => (
            <span
              key={perm}
              className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/70"
            >
              {perm}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-lg font-bold text-white">{apiKey.usageThisMonth.toLocaleString()}</p>
          <p className="text-xs text-white/50">Requests/month</p>
        </div>
        <div>
          <p className="text-lg font-bold text-white">{apiKey.rateLimit.toLocaleString()}</p>
          <p className="text-xs text-white/50">Rate limit/hr</p>
        </div>
        <div>
          <p className="text-lg font-bold text-white">{apiKey.usageThisHour}</p>
          <p className="text-xs text-white/50">This hour</p>
        </div>
      </div>

      {/* Last Used */}
      {apiKey.lastUsedAt && (
        <div className="mt-4 flex items-center justify-between text-xs text-white/40">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Last used: {new Date(apiKey.lastUsedAt).toLocaleString("vi-VN")}
          </span>
          <button
            onClick={onRevoke}
            className="text-red-400 hover:text-red-300 flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" />
            Revoke
          </button>
        </div>
      )}
    </GlassCard>
  );
}

function UsageLogRow({ log }: { log: ApiUsageLog }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3">
        <span className={`px-2 py-0.5 rounded text-xs font-mono ${
          log.method === "GET" ? "bg-blue-500/20 text-blue-400" :
          log.method === "POST" ? "bg-emerald-500/20 text-emerald-400" :
          log.method === "PUT" ? "bg-amber-500/20 text-amber-400" :
          "bg-red-500/20 text-red-400"
        }`}>
          {log.method}
        </span>
        <span className="text-sm text-white/80 font-mono">{log.endpoint}</span>
      </div>
      <div className="flex items-center gap-4 text-xs text-white/50">
        <span className={log.statusCode >= 400 ? "text-red-400" : "text-emerald-400"}>
          {log.statusCode}
        </span>
        <span>{log.responseTimeMs}ms</span>
        <span>{new Date(log.timestamp).toLocaleTimeString("vi-VN")}</span>
      </div>
    </div>
  );
}

function WebhookCard({ webhook }: { webhook: Webhook }) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-white">{webhook.name}</h4>
          <p className="mt-1 text-sm text-white/50 font-mono truncate max-w-[300px]">
            {webhook.url}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {webhook.isActive ? (
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              Active
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-red-400">
              <AlertCircle className="h-3 w-3" />
              Inactive
            </span>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {webhook.events.map((event) => (
          <span
            key={event}
            className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-xs text-cyan-400"
          >
            {event}
          </span>
        ))}
      </div>
      {webhook.lastDeliveryAt && (
        <div className="mt-3 flex items-center gap-2 text-xs text-white/40">
          <Clock className="h-3 w-3" />
          Last delivery: {new Date(webhook.lastDeliveryAt).toLocaleString("vi-VN")}
          <span className={webhook.lastDeliveryStatus === "success" ? "text-emerald-400" : "text-red-400"}>
            ({webhook.lastDeliveryStatus})
          </span>
        </div>
      )}
    </GlassCard>
  );
}

export default function ApiManagementPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [recentLogs, setRecentLogs] = useState<ApiUsageLog[]>([]);
  const [activeTab, setActiveTab] = useState<"keys" | "webhooks" | "docs">("keys");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load mock data
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: load initial demo data on mount
    setApiKeys(MOCK_API_KEYS_LIST.slice(0, 3)); // Show first 3 keys for demo org
    setWebhooks(MOCK_WEBHOOKS.slice(0, 2));
    setRecentLogs(MOCK_API_USAGE_LOGS);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="container-app py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-white/10" />
          <div className="grid gap-4 lg:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 rounded-xl bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/developer/console"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Developer Console
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">API Management</h1>
            <p className="mt-1 text-white/60">Manage API keys and webhooks</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-black hover:bg-amber-400">
            <Plus className="h-4 w-4" />
            Create API Key
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-white/5 p-1">
        {[
          { id: "keys", label: "API Keys", icon: Key },
          { id: "webhooks", label: "Webhooks", icon: WebhookIcon },
          { id: "docs", label: "Documentation", icon: Code },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white/10 text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "keys" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* API Keys */}
          <div className="lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-2">
              {apiKeys.map((key) => (
                <ApiKeyCard
                  key={key.id}
                  apiKey={key}
                  onRevoke={() => {
                    // In real app, call API to revoke
                    console.log("Revoke key:", key.id);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-cyan-400" />
                  Recent API Activity
                </h2>
                <span className="text-xs text-white/40">Last 24 hours</span>
              </div>
              <div>
                {recentLogs.map((log) => (
                  <UsageLogRow key={log.id} log={log} />
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {activeTab === "webhooks" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-white/60">Receive real-time notifications for attestation events</p>
            <Link
              href="/developer/api/webhooks"
              className="flex items-center gap-2 rounded-lg bg-cyan-500/20 px-4 py-2 text-sm font-medium text-cyan-400 hover:bg-cyan-500/30"
            >
              <Plus className="h-4 w-4" />
              Add Webhook
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {webhooks.map((webhook) => (
              <WebhookCard key={webhook.id} webhook={webhook} />
            ))}
          </div>
          {webhooks.length === 0 && (
            <GlassCard className="p-12 text-center">
              <WebhookIcon className="mx-auto h-16 w-16 text-white/20" />
              <p className="mt-4 text-white/60">No webhooks configured</p>
              <Link
                href="/developer/api/webhooks"
                className="mt-4 inline-flex items-center gap-2 text-cyan-400 hover:underline"
              >
                <Plus className="h-4 w-4" />
                Add your first webhook
              </Link>
            </GlassCard>
          )}
        </div>
      )}

      {activeTab === "docs" && (
        <div className="grid gap-6 md:grid-cols-2">
          <GlassCard className="p-6">
            <h3 className="font-semibold text-white mb-4">Quick Start</h3>
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-800/50 p-4 font-mono text-sm">
                <p className="text-white/50 mb-2"># Fetch project data</p>
                <p className="text-cyan-400">
                  curl -H &quot;X-API-Key: YOUR_KEY&quot; \
                </p>
                <p className="text-white/80 pl-4">
                  https://api.realtera.vn/v1/projects
                </p>
              </div>
              <div className="rounded-lg bg-slate-800/50 p-4 font-mono text-sm">
                <p className="text-white/50 mb-2"># Check attestation</p>
                <p className="text-cyan-400">
                  curl -H &quot;X-API-Key: YOUR_KEY&quot; \
                </p>
                <p className="text-white/80 pl-4">
                  https://api.realtera.vn/v1/attestations/vinhomes-grand-park
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-semibold text-white mb-4">Available Endpoints</h3>
            <div className="space-y-3">
              {[
                { method: "GET", path: "/v1/projects", desc: "List all projects" },
                { method: "GET", path: "/v1/projects/:slug", desc: "Get project details" },
                { method: "GET", path: "/v1/attestations/:slug", desc: "Get attestation" },
                { method: "GET", path: "/v1/evidence/:slug", desc: "Get evidence pack" },
                { method: "POST", path: "/v1/webhooks", desc: "Register webhook" },
              ].map((endpoint, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono ${
                    endpoint.method === "GET" ? "bg-blue-500/20 text-blue-400" : "bg-emerald-500/20 text-emerald-400"
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-white/80">{endpoint.path}</code>
                  <span className="text-white/40 hidden sm:inline">- {endpoint.desc}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <a
                href="https://docs.realtera.vn/api"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-amber-400 hover:underline"
              >
                Full API Documentation
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </GlassCard>

          <GlassCard className="p-6 md:col-span-2">
            <h3 className="font-semibold text-white mb-4">Permissions</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(PERMISSION_DEFINITIONS).map(([perm, def]) => (
                <div key={perm} className="p-3 rounded-lg bg-white/5">
                  <p className="font-medium text-white text-sm">{def.name}</p>
                  <p className="text-xs text-white/50 mt-1">{def.description}</p>
                  <code className="text-xs text-cyan-400 mt-2 block">{perm}</code>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
