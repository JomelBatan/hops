import { boardApi } from "@/libs/api";
import { getSocket } from "@/libs/socket";
import { Activity } from "@/types";
import { Activity as ActIcon, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Avatar from "./ui/Avatar";
import { relativeTime } from "@/libs/utils";

interface ActivityFeedProps {
  open: boolean;
  onClose: () => void;
  boardId: string;
}

export default function ActivityFeed({
  open,
  onClose,
  boardId,
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        if (!open) return;
        const res = await boardApi.activity(boardId, 50);
        if (!res.data) return;
        setActivities(res.data.activities);
      } catch (error) {
        if (error instanceof Error) {
          console.log("Error: ", error);
          toast.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [open, boardId]);
  // Live updates (subscribe always so the feed stays fresh when reopened).
  useEffect(() => {
    const socket = getSocket();

    const onNew = (a: Activity) => {
      setActivities((prev) => [a, ...prev].slice(0, 80));
    };

    socket.on("activity:new", onNew);

    return () => {
      socket.off("activity:new", onNew);
    };
  }, [boardId]);
  return (
    <>
      {open && (
        <>
          <div
            className="fixed inset-0 z-30 bg-ink/35 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside className="glass fixed right-0 top-0 z-40 flex h-full w-80 flex-col border-l">
            <div className="flex items-center justify-between border-b px-4 py-4">
              <h3 className="flex items-center gap-2 font-display text-sm font-semibold tracking-tight text-primary/60">
                <ActIcon className="h-4 w-4 " /> Activity
              </h3>

              <button
                onClick={onClose}
                className="rounded p-1 text-muted hover:bg-surface-2 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="skeleton h-12 rounded-lg" />
                  ))}
                </div>
              ) : activities.length === 0 ? (
                <p className="px-2 py-8 text-center text-sm text-faint">
                  No activity yet.
                </p>
              ) : (
                <ul className="space-y-1">
                  {activities.map((a) => (
                    <li
                      key={a.id}
                      className="flex gap-3 rounded-lg px-2 py-2 hover:bg-surface/20"
                    >
                      <Avatar
                        name={a.user_name || "System"}
                        id={a.user_id || a.id}
                        src={a.user_avatar}
                        size="xs"
                      />
                      <div className="min-w-0">
                        <p className="text-sm leading-snug text-muted">
                          {a.message}
                        </p>
                        <p className="mt-0.5 text-[11px] text-faint">
                          {relativeTime(a.created_at)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
}
