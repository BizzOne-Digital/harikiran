"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ListToolbar, PaginationBar, formatDate } from "@/components/admin/ListToolbar";
import { LEAD_STATUSES } from "@/config/site";
import {
  getLead,
  updateLead,
  bulkUpdateLeadStatus,
  markLeadSpam,
  exportLeadsCsv,
  deleteLead,
} from "@/actions/leads";
import type { LeadStatus } from "@/types";

type LeadListItem = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: LeadStatus;
  priority: string;
  serviceInterest?: string;
  leadSource: string;
  message?: string;
  formType: string;
  createdAt: string;
  internalNotes?: { note: string; createdAt: string }[];
};

type LeadDetail = LeadListItem & {
  company?: string;
  clientType?: string;
  preferredContact?: string;
  timeline?: string;
  landingPage?: string;
  lastContactedAt?: string;
};

export function LeadsClient({
  items,
  page,
  totalPages,
  statusCounts,
}: {
  items: LeadListItem[];
  page: number;
  totalPages: number;
  statusCounts: { status: LeadStatus; count: number }[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detailOpen, setDetailOpen] = useState(false);
  const [detail, setDetail] = useState<LeadDetail | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<LeadStatus>("contacted");

  function toggleSelect(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  function toggleAll() {
    if (selected.size === items.length) setSelected(new Set());
    else setSelected(new Set(items.map((i) => i._id)));
  }

  async function openDetail(id: string) {
    setLoading(true);
    const lead = await getLead(id);
    setLoading(false);
    if (lead) {
      setDetail(lead as LeadDetail);
      setNote("");
      setDetailOpen(true);
    } else {
      toast.error("Lead not found");
    }
  }

  async function handleStatusChange(status: LeadStatus) {
    if (!detail) return;
    setLoading(true);
    const result = await updateLead(detail._id, { status });
    setLoading(false);
    if (result.success) {
      toast.success("Status updated");
      setDetail({ ...detail, status });
      router.refresh();
    } else {
      toast.error(result.error || "Update failed");
    }
  }

  async function handleAddNote() {
    if (!detail || !note.trim()) return;
    setLoading(true);
    const result = await updateLead(detail._id, { note: note.trim() });
    setLoading(false);
    if (result.success) {
      toast.success("Note added");
      const updated = await getLead(detail._id);
      if (updated) setDetail(updated as LeadDetail);
      setNote("");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to add note");
    }
  }

  async function handleBulkStatus() {
    if (selected.size === 0) return;
    setLoading(true);
    const result = await bulkUpdateLeadStatus({
      ids: Array.from(selected),
      status: bulkStatus,
    });
    setLoading(false);
    if (result.success) {
      toast.success(`Updated ${selected.size} leads`);
      setSelected(new Set());
      router.refresh();
    } else {
      toast.error(result.error || "Bulk update failed");
    }
  }

  async function handleMarkSpam() {
    if (!detail) return;
    setLoading(true);
    const result = await markLeadSpam(detail._id);
    setLoading(false);
    if (result.success) {
      toast.success("Marked as spam");
      setDetail({ ...detail, status: "spam" });
      router.refresh();
    } else {
      toast.error(result.error || "Failed");
    }
  }

  async function handleExport() {
    setLoading(true);
    const result = await exportLeadsCsv({});
    setLoading(false);
    if (result.success && result.data) {
      const blob = new Blob([result.data.csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported");
    } else if (!result.success) {
      toast.error(result.error || "Export failed");
    }
  }

  async function handleDelete(id: string) {
    setLoading(true);
    const result = await deleteLead(id);
    setLoading(false);
    if (result.success) {
      toast.success("Lead deleted");
      setDetailOpen(false);
      router.refresh();
    } else {
      toast.error(result.error || "Delete failed");
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {statusCounts.map(({ status, count }) => (
          <Link
            key={status}
            href={`/admin/leads?status=${status}`}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            <StatusBadge status={status} type="lead" />{" "}
            <span className="ml-1 text-slate-400">{count}</span>
          </Link>
        ))}
      </div>
      <ListToolbar
        statusOptions={LEAD_STATUSES.map((s) => ({
          value: s,
          label: s.charAt(0).toUpperCase() + s.slice(1).replace("-", " "),
        }))}
        placeholder="Search leads…"
      />
      {selected.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-3">
          <span className="text-sm text-slate-600">
            {selected.size} selected
          </span>
          <Select
            value={bulkStatus}
            onValueChange={(v) => setBulkStatus(v as LeadStatus)}
          >
            <SelectTrigger className="h-8 w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEAD_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" disabled={loading} onClick={handleBulkStatus}>
            Apply status
          </Button>
        </div>
      )}
      <div className="mb-4 flex justify-end">
        <Button variant="outline" size="sm" disabled={loading} onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
      {items.length > 0 && (
        <div className="mb-2 flex items-center gap-2">
          <Checkbox
            checked={selected.size === items.length}
            onCheckedChange={toggleAll}
          />
          <span className="text-sm text-slate-500">Select all on page</span>
        </div>
      )}
      <DataTable
        data={items}
        getRowId={(r) => r._id}
        emptyTitle="No leads yet"
        emptyDescription="Leads from website forms will appear here."
        columns={[
          {
            key: "select",
            header: "",
            className: "w-10",
            cell: (r) => (
              <Checkbox
                checked={selected.has(r._id)}
                onCheckedChange={() => toggleSelect(r._id)}
              />
            ),
          },
          {
            key: "name",
            header: "Name",
            cell: (r) => (
              <button
                type="button"
                className="font-medium text-slate-900 hover:underline"
                onClick={() => openDetail(r._id)}
              >
                {r.name}
              </button>
            ),
          },
          { key: "email", header: "Email", cell: (r) => r.email },
          {
            key: "status",
            header: "Status",
            cell: (r) => <StatusBadge status={r.status} type="lead" />,
          },
          {
            key: "source",
            header: "Source",
            cell: (r) => r.leadSource,
          },
          {
            key: "created",
            header: "Created",
            cell: (r) => formatDate(r.createdAt),
          },
          {
            key: "actions",
            header: "",
            className: "w-16",
            cell: (r) => (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openDetail(r._id)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            ),
          },
        ]}
      />
      <PaginationBar page={page} totalPages={totalPages} />
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{detail?.name || "Lead detail"}</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="grid gap-2 text-sm">
                <p>
                  <span className="text-slate-500">Email:</span> {detail.email}
                </p>
                {detail.phone && (
                  <p>
                    <span className="text-slate-500">Phone:</span>{" "}
                    {detail.phone}
                  </p>
                )}
                {detail.company && (
                  <p>
                    <span className="text-slate-500">Company:</span>{" "}
                    {detail.company}
                  </p>
                )}
                {detail.serviceInterest && (
                  <p>
                    <span className="text-slate-500">Service:</span>{" "}
                    {detail.serviceInterest}
                  </p>
                )}
                {detail.message && (
                  <div>
                    <p className="text-slate-500">Message</p>
                    <p className="mt-1 whitespace-pre-wrap">{detail.message}</p>
                  </div>
                )}
                <p>
                  <span className="text-slate-500">Form:</span> {detail.formType}{" "}
                  · {detail.leadSource}
                </p>
                <p>
                  <span className="text-slate-500">Created:</span>{" "}
                  {formatDate(detail.createdAt)}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={detail.status}
                  onValueChange={(v) => handleStatusChange(v as LeadStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-note">Add internal note</Label>
                <Textarea
                  id="lead-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
                <Button
                  size="sm"
                  disabled={loading || !note.trim()}
                  onClick={handleAddNote}
                >
                  Add note
                </Button>
              </div>
              {detail.internalNotes && detail.internalNotes.length > 0 && (
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <ul className="max-h-40 space-y-2 overflow-y-auto text-sm">
                    {detail.internalNotes.map((n, i) => (
                      <li
                        key={i}
                        className="rounded-md border border-slate-100 p-2"
                      >
                        <p>{n.note}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {formatDate(n.createdAt)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  onClick={handleMarkSpam}
                >
                  Mark spam
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={loading}
                  onClick={() => handleDelete(detail._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
