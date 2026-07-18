"use client";
import { useAuth } from "@/context/AuthContext";
import React from "react";

export default function Topbar() {
  const { user, logout } = useAuth();

  return <div>Topbar</div>;
}
