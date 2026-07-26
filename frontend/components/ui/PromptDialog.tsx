import React, { FormEvent, useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { Input } from "./Input";
import Button from "./Button";

interface PromptDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (v: string) => void;
  title?: string;
  description: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  submitLabel?: string;
  loading?: boolean;
}

export default function PromptDialog({
  open,
  onClose,
  onSubmit,
  title = "",
  description,
  label,
  placeholder,
  defaultValue = "",
  submitLabel = "Add",
  loading = false,
}: PromptDialogProps) {
  const [value, setValue] = useState(defaultValue);
  const submitted = useRef(false);

  useEffect(() => {
    if (open) {
      setValue(defaultValue);
      submitted.current = false;
    }
  }, [open, defaultValue]);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const v = value.trim();
    if (!v || submitted.current) return;
    submitted.current = true;
    onSubmit(v);
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
    >
      <form onSubmit={submit} className="space-y-4">
        <Input
          label={label}
          placeholder={placeholder}
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={!value.trim()}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
