import NavBar from "@/components/layout/NavBar";
import React from "react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavBar />
      {children}
    </div>
  );
}
