import { aiApi, api } from "@/libs/api";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Modal from "../ui/Modal";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
} from "lucide-react";
import { Summary, Task } from "@/types";

interface SectionProps {
  icon: React.ElementType;
  title?: string;
  items: string[];
  color: string;
}
interface AISummaryModal {
  open: boolean;
  onClose: () => void;
  boardId: string;
}
function Section({ icon: Icon, title, items, color }: SectionProps) {
  if (!items?.length) return null;
  return (
    <div>
      <h4
        className="mb-2 flex items-center gap-2 text-sm font-semibold"
        style={{ color }}
      >
        <Icon className="h-4 w-4" /> {title}
      </h4>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm text-muted">
            <span
              className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
            />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AISummaryModal({
  open,
  onClose,
  boardId,
}: AISummaryModal) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    async function init() {
      try {
        if (!open) return;
        setSummary(null);
        setLoading(true);
        const res = await aiApi.summary(boardId);

        if (!res.data) return;

        setSummary(res.data.summary);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load summary.";
        console.log(error);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [open, boardId, onClose]);
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={
        <span className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-brand-500" /> AI Sprint Summary
        </span>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-muted">
          <Loader2 className="h-5 w-5 animate-spin text-brand-500" /> Analyzing
          board…
        </div>
      ) : summary ? (
        <div className="space-y-5">
          {summary.headline && (
            <p className="rounded-2xl border border-brand-500/15 bg-primary/50 p-4 text-sm leading-relaxed">
              {summary.headline}
            </p>
          )}
          <Section
            icon={CheckCircle2}
            title="Completed"
            items={summary.completed}
            color="#10b981"
          />
          <Section
            icon={Clock}
            title="In progress"
            items={summary.inProgress}
            color="#fbbf24"
          />
          <Section
            icon={AlertTriangle}
            title="Risks & blockers"
            items={summary.risks}
            color="#f43f5e"
          />
          <Section
            icon={ArrowRight}
            title="Recommendations"
            items={summary.recommendations}
            color="#818cf8"
          />
        </div>
      ) : null}
    </Modal>
  );
}
