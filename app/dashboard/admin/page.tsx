"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Logo } from "@/content";
import type { AdminJourneyRow } from "@/lib/admin-journey-list";

type JourneysResponse = {
  items: AdminJourneyRow[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDashboardPage() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [journeys, setJourneys] = useState<JourneysResponse | null>(null);
  const [journeysLoading, setJourneysLoading] = useState(false);
  const [journeysError, setJourneysError] = useState("");
  const [page, setPage] = useState(1);

  const [showSettings, setShowSettings] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const loadSession = useCallback(async () => {
    setCheckingSession(true);
    try {
      const res = await fetch("/api/admin/session");
      if (res.ok) {
        const data = (await res.json()) as { username: string };
        setUsername(data.username);
      } else {
        setUsername(null);
      }
    } catch {
      setUsername(null);
    } finally {
      setCheckingSession(false);
    }
  }, []);

  const loadJourneys = useCallback(async (p: number) => {
    setJourneysLoading(true);
    setJourneysError("");
    try {
      const res = await fetch(`/api/admin/journeys?page=${p}`);
      if (!res.ok) {
        if (res.status === 401) {
          setUsername(null);
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error("Failed to load submissions");
      }
      const data = (await res.json()) as JourneysResponse;
      setJourneys(data);
      setPage(data.page);
    } catch (e) {
      setJourneysError(e instanceof Error ? e.message : "Failed to load submissions");
    } finally {
      setJourneysLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (username) void loadJourneys(page);
  }, [username, page, loadJourneys]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUser, password: loginPass }),
      });
      const data = (await res.json()) as { error?: string; username?: string };
      if (!res.ok) {
        setLoginError(data.error ?? "Login failed");
        return;
      }
      setUsername(data.username ?? loginUser);
      setLoginPass("");
      setPage(1);
    } catch {
      setLoginError("Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setUsername(null);
    setJourneys(null);
    setShowSettings(false);
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = (await res.json()) as { error?: string; ok?: boolean };
      if (!res.ok) {
        setPasswordMessage(data.error ?? "Failed to update password");
        return;
      }
      setPasswordMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setPasswordMessage("Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-sm text-[#5C6570]">Loading…</p>
      </div>
    );
  }

  if (!username) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-[#E2E8E4] bg-white p-8 shadow-[0_4px_24px_rgba(12,27,42,0.08)]">
          <div className="mb-8 flex justify-center">
            <div className="relative h-14 w-40">
              <Image src={Logo} alt="WeStay" fill className="object-contain" priority />
            </div>
          </div>
          <h1 className="text-center text-xl font-semibold text-[#0C1B2A]">Admin Login</h1>
          <p className="mt-2 text-center text-sm text-[#5C6570]">
            Sign in to view journey submissions and download reports.
          </p>
          <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-[#0C1B2A]">Username</span>
              <input
                type="text"
                autoComplete="username"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                className="h-11 rounded-xl border border-[#E2E8E4] px-3 outline-none focus:border-[#2A9D8F]"
                required
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-[#0C1B2A]">Password</span>
              <input
                type="password"
                autoComplete="current-password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="h-11 rounded-xl border border-[#E2E8E4] px-3 outline-none focus:border-[#2A9D8F]"
                required
              />
            </label>
            {loginError ? (
              <p className="text-sm text-[#E76F51]" role="alert">
                {loginError}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={loginLoading}
              className="mt-2 h-11 rounded-[25px] bg-[#ff6b5c] text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
            >
              {loginLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-10 w-28 shrink-0">
            <Image src={Logo} alt="WeStay" fill className="object-contain" priority />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#0C1B2A]">Admin Dashboard</h1>
            <p className="text-sm text-[#5C6570]">Signed in as {username}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setShowSettings((v) => !v);
              setPasswordMessage("");
            }}
            className="h-10 rounded-[25px] border border-[#2A9D8F] px-5 text-sm font-semibold text-[#2A9D8F] transition hover:bg-[#EBF7F6]"
          >
            Settings
          </button>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="h-10 rounded-[25px] bg-[#0C1B2A] px-5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Logout
          </button>
        </div>
      </header>

      {showSettings ? (
        <section className="mb-8 rounded-2xl border border-[#E2E8E4] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0C1B2A]">Change password</h2>
          <form onSubmit={handlePasswordChange} className="mt-4 grid max-w-md gap-4">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium">Current password</span>
              <input
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-10 rounded-xl border border-[#E2E8E4] px-3 outline-none focus:border-[#2A9D8F]"
                required
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium">New password</span>
              <input
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-10 rounded-xl border border-[#E2E8E4] px-3 outline-none focus:border-[#2A9D8F]"
                required
                minLength={8}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium">Confirm new password</span>
              <input
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-10 rounded-xl border border-[#E2E8E4] px-3 outline-none focus:border-[#2A9D8F]"
                required
                minLength={8}
              />
            </label>
            {passwordMessage ? (
              <p
                className={`text-sm ${passwordMessage.includes("success") ? "text-[#2A9D8F]" : "text-[#E76F51]"}`}
                role="status"
              >
                {passwordMessage}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={passwordLoading}
              className="h-10 w-fit rounded-[25px] bg-[#ff6b5c] px-6 text-sm font-semibold text-white disabled:opacity-60"
            >
              {passwordLoading ? "Saving…" : "Update password"}
            </button>
          </form>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-[#E2E8E4] bg-white shadow-sm">
        <div className="border-b border-[#E2E8E4] px-6 py-4">
          <h2 className="text-lg font-semibold text-[#0C1B2A]">Journey submissions</h2>
          <p className="text-sm text-[#5C6570]">
            {journeys ? `${journeys.total} total · page ${journeys.page} of ${journeys.totalPages}` : "Loading…"}
          </p>
        </div>

        {journeysError ? (
          <p className="px-6 py-8 text-sm text-[#E76F51]" role="alert">
            {journeysError}
          </p>
        ) : journeysLoading && !journeys ? (
          <p className="px-6 py-8 text-sm text-[#5C6570]">Loading submissions…</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-left text-sm">
                <thead className="bg-[#0C1B2A] text-xs uppercase tracking-wide text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Updated</th>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Phone</th>
                    <th className="px-4 py-3 font-semibold">Address</th>
                    <th className="px-4 py-3 font-semibold">Plan</th>
                    <th className="px-4 py-3 font-semibold">Report</th>
                  </tr>
                </thead>
                <tbody>
                  {journeys?.items.length ? (
                    journeys.items.map((row) => (
                      <tr key={row.journeyId} className="border-b border-[#E2E8E4] even:bg-[#F5F7FA]">
                        <td className="px-4 py-3 whitespace-nowrap text-[#5C6570]">
                          {formatDate(row.updatedAt)}
                        </td>
                        <td className="px-4 py-3 font-medium text-[#0C1B2A]">{row.contactName}</td>
                        <td className="px-4 py-3 text-[#5C6570]">{row.email}</td>
                        <td className="px-4 py-3 text-[#5C6570]">{row.phone}</td>
                        <td className="max-w-[200px] truncate px-4 py-3 text-[#5C6570]" title={row.address}>
                          {row.address}
                        </td>
                        <td className="px-4 py-3 capitalize text-[#5C6570]">{row.planId}</td>
                        <td className="px-4 py-3">
                          <a
                            href={`/api/admin/journeys/${encodeURIComponent(row.journeyId)}/pdf`}
                            className="inline-flex h-9 items-center rounded-[20px] bg-[#2A9D8F] px-4 text-xs font-semibold text-white transition hover:brightness-105"
                          >
                            Download PDF
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-[#5C6570]">
                        No submissions yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {journeys && journeys.totalPages > 1 ? (
              <div className="flex items-center justify-between gap-4 border-t border-[#E2E8E4] px-6 py-4">
                <button
                  type="button"
                  disabled={page <= 1 || journeysLoading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-9 rounded-[20px] border border-[#E2E8E4] px-4 text-sm font-medium disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-[#5C6570]">
                  Page {journeys.page} of {journeys.totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= journeys.totalPages || journeysLoading}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-9 rounded-[20px] border border-[#E2E8E4] px-4 text-sm font-medium disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
