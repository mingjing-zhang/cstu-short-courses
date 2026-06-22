"use client";

import { useCallback, useEffect, useState } from "react";

type Student = { name: string; email: string };
type CourseAtt = { id: string; title: string; sessions: number; students: Student[] };

export default function AttendanceTab() {
  const [courses, setCourses] = useState<CourseAtt[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const d = await fetch("/api/attendance").then((r) => r.json());
    setCourses(d.courses);
    setAttendance(d.attendance ?? {});
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggle(key: string, present: boolean) {
    // optimistic
    setAttendance((a) => {
      const next = { ...a };
      if (present) next[key] = true;
      else delete next[key];
      return next;
    });
    await fetch("/api/attendance", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key, present }),
    });
  }

  if (loading) return <div className="text-muted text-sm py-10">Loading…</div>;

  return (
    <>
      <h2 className="font-display text-3xl">Attendance</h2>
      {courses.length === 0 ? (
        <p className="text-muted text-sm mt-4">
          No paid students yet — enroll someone first and they&apos;ll appear here.
        </p>
      ) : (
        courses.map((c) => (
          <div key={c.id} className="mt-8">
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-xl">{c.title}</h3>
              <span className="text-xs text-muted">
                {c.students.length} students · {c.sessions} sessions
              </span>
            </div>
            <div className="mt-3 rounded-2xl border hairline overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-widest text-muted bg-paper-2 border-b hairline">
                    <th className="text-left font-normal px-4 py-3">Student</th>
                    {Array.from({ length: c.sessions }, (_, i) => (
                      <th key={i} className="px-2 py-3 font-normal w-9">
                        {i + 1}
                      </th>
                    ))}
                    <th className="px-3 py-3 font-normal text-right">%</th>
                  </tr>
                </thead>
                <tbody>
                  {c.students.map((s) => {
                    const present = Array.from({ length: c.sessions }, (_, i) =>
                      Boolean(attendance[`${c.id}:${s.email}:${i + 1}`])
                    );
                    const pct = Math.round(
                      (present.filter(Boolean).length / c.sessions) * 100
                    );
                    return (
                      <tr key={s.email} className="border-b hairline last:border-0">
                        <td className="px-4 py-3">
                          <div className="font-medium">{s.name}</div>
                          <div className="text-muted text-xs">{s.email}</div>
                        </td>
                        {present.map((on, i) => {
                          const key = `${c.id}:${s.email}:${i + 1}`;
                          return (
                            <td key={i} className="px-2 py-3 text-center">
                              <button
                                onClick={() => toggle(key, !on)}
                                aria-label={`session ${i + 1}`}
                                className={`h-5 w-5 rounded border transition ${
                                  on
                                    ? "bg-accent border-accent text-paper"
                                    : "border-hairline hover:border-accent"
                                }`}
                              >
                                {on ? "✓" : ""}
                              </button>
                            </td>
                          );
                        })}
                        <td className="px-3 py-3 text-right text-muted">{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </>
  );
}
