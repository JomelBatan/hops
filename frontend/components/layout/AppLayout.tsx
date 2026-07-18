import { createContext, useCallback, useState } from "react";

const LayoutContext = createContext(null);

export function LayoutInner() {
  const [createOpen, setCreateOpen] = useState<boolean>(false);
  const [commandOpen, setCommandOpen] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("sidebar-collapsed") === "true",
  );

  const openCreateBoard = useCallback(() => setCreateOpen(true), []);
  const openCommand = useCallback(() => setCommandOpen(true), []);
  const toggleSideBar = useCallback(() =>
    setCollapsed((c) => {
      const next = !c;
      localStoragee.setItem("sidebar-collapsed", String(next));
      return next;
    }),
  );
}
