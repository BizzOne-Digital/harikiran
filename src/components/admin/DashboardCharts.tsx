"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDate } from "@/lib/utilities/date";
import Link from "next/link";

const COLORS = ["#0f172a", "#334155", "#64748b", "#94a3b8", "#cbd5e1", "#e2e8f0", "#fca5a5"];

interface DashboardProps {
  stats: {
    counts: Record<string, number>;
    leadStatusCounts: { status: string; count: number }[];
    recentLeads: Array<{
      _id: string;
      name: string;
      email: string;
      status: string;
      createdAt: string;
    }>;
    leadsByDay: { date: string; count: number }[];
  };
}

export function DashboardCharts({ stats }: DashboardProps) {
  const statCards = [
    { label: "Published services", value: stats.counts.services, href: "/admin/services" },
    { label: "Published offerings", value: stats.counts.offerings, href: "/admin/offerings" },
    { label: "Blog posts", value: stats.counts.blogPosts, href: "/admin/blog" },
    { label: "Pages", value: stats.counts.pages, href: "/admin/pages" },
    { label: "Total leads", value: stats.counts.leads, href: "/admin/leads" },
    { label: "Subscribers", value: stats.counts.subscribers, href: "/admin/forms" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  {card.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-slate-900">{card.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Leads by status</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {stats.leadStatusCounts.every((s) => s.count === 0) ? (
              <p className="flex h-full items-center justify-center text-sm text-slate-500">
                No leads yet
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.leadStatusCounts.filter((s) => s.count > 0)}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(props) => {
                      const entry = props.payload as { status?: string; count?: number } | undefined;
                      return `${entry?.status ?? ""}: ${entry?.count ?? 0}`;
                    }}
                  >
                    {stats.leadStatusCounts.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Leads (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {stats.leadsByDay.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-slate-500">
                No lead activity in the last 30 days
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.leadsByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0f172a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent leads</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentLeads.length === 0 ? (
            <p className="text-sm text-slate-500">No leads received yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.recentLeads.map((lead) => (
                <Link
                  key={lead._id}
                  href="/admin/leads"
                  className="flex items-center justify-between py-3 hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium text-slate-900">{lead.name}</p>
                    <p className="text-sm text-slate-500">{lead.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={lead.status} type="lead" />
                    <span className="text-xs text-slate-400">
                      {formatDate(lead.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
