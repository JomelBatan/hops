import { boardApi } from "@/libs/api";
import { User } from "@/types";
import React, { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import Modal from "../ui/Modal";
import { Input } from "../ui/Input";
import Button from "../ui/Button";
import { UserPlus, X } from "lucide-react";
import Avatar from "../ui/Avatar";

interface MembersModalProps {
  open: boolean;
  onClose: () => void;
  boardId: string;
  members: User[];
  setMembers: any;
  canManage: boolean;
  ownerId: string;
}

export default function MembersModal({
  open,
  onClose,
  boardId,
  members,
  setMembers,
  canManage,
  ownerId,
}: MembersModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function invite(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await boardApi.addMember(boardId, { email: email.trim() });
      if (!res.data) return;
      const member = res.data.member;
      setMembers((prev: any) => {
        const exists = prev.find((m: User) => m.id === member.id);
        return exists
          ? prev.map((m: User) =>
              m.id === member.id ? { ...m, ...member } : m,
            )
          : [...prev, member];
      });
      toast.success(`${member.name} added`);
      setEmail("");
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error: ", error);
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }
  async function remove(userId: string) {
    try {
      await boardApi.removeMember(boardId, userId);
      setMembers((prev: any) => prev.filter((m: User) => m.id !== userId));
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error: ", error);
        toast.error(error.message);
      }
    }
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Members"
      description="Invite teammates to collaborate in real time."
    >
      {canManage && (
        <form onSubmit={invite} className="mb-5 flex gap-2">
          <Input
            placeholder="teammate@company.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" loading={loading} className="shrink-0">
            <UserPlus className="h-4 w-4" /> Invite
          </Button>
        </form>
      )}

      <ul className="space-y-1">
        {members.map((m) => (
          <li
            key={m.id}
            className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-surface-2"
          >
            <Avatar name={m.name} id={m.id} src={m.avatar_url} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-black">
                {m.name}
              </p>
              <p className="truncate text-xs text-faint">{m.email}</p>
            </div>
            <span className="rounded-full bg-gray-200 px-2.5 py-1 text-[11px] font-medium capitalize text-muted">
              {m.role}
            </span>
            {canManage && m.id !== ownerId && (
              <button
                onClick={() => remove(m.id)}
                className="rounded-full p-1.5 text-faint transition-colors hover:bg-elevated hover:text-priority-urgent"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </li>
        ))}
      </ul>
    </Modal>
  );
}
