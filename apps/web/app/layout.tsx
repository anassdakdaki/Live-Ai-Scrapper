"use client";

import "../app/globals.css";
import React from "react";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
      </body>
    </html>
  );
}
