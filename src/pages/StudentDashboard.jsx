
import { useMemo, useState } from "react";
import { useAssignments } from "../context/AppContext";

import {
  Search,
  CalendarDays,
  ExternalLink,
  CheckCircle2,
  Clock,
  FileText,
  ArrowUpDown,
  ClipboardList,
  GraduationCap,
  X,
  BookOpen,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function StudentDashboard({ user }) {
  const { assignments = [], submitAssignment } = useAssignments();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("dueDate");
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Student ke assignments
  const myAssignments = useMemo(() => {
    return assignments.filter((assignment) =>
      assignment.assignedTo?.includes(user?.id)
    );
  }, [assignments, user?.id]);

  // Submitted assignments count
  const submittedCount = myAssignments.filter((assignment) =>
    Boolean(assignment.submissions?.[user?.id])
  ).length;

  const pendingCount = myAssignments.length - submittedCount;

  const completionPercentage =
    myAssignments.length > 0
      ? Math.round((submittedCount / myAssignments.length) * 100)
      : 0;

  // Search, filter and sort
  const filteredAssignments = useMemo(() => {
    return myAssignments
      .filter((assignment) => {
        const title = assignment.title || "";
        const description = assignment.description || "";

        const matchesSearch =
          title.toLowerCase().includes(search.toLowerCase()) ||
          description.toLowerCase().includes(search.toLowerCase());

        const isSubmitted = Boolean(
          assignment.submissions?.[user?.id]
        );

        const matchesStatus =
          statusFilter === "All" ||
          (statusFilter === "Submitted" && isSubmitted) ||
          (statusFilter === "Pending" && !isSubmitted);

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortOrder === "title") {
          return (a.title || "").localeCompare(b.title || "");
        }

        return (a.dueDate || "").localeCompare(b.dueDate || "");
      });
  }, [myAssignments, search, statusFilter, sortOrder, user?.id]);

  // Date format
  const formatDate = (dateString) => {
    if (!dateString) return "No due date";

    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) return "No due date";

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Check if due date has passed
  const isOverdue = (dateString) => {
    if (!dateString) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(`${dateString}T00:00:00`);

    return dueDate < today;
  };

  // Submit assignment
  const handleSubmit = () => {
    if (!selectedAssignment) return;

    submitAssignment(selectedAssignment.id, user.id);
    setSelectedAssignment(null);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-red-800 via-red-700 to-rose-600 px-6 py-8 text-white shadow-xl shadow-red-100 sm:px-9 sm:py-10">

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-35 border-white/10" />
          <div className="pointer-events-none absolute -bottom-28 right-40 h-64 w-64 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col justify-between gap-7 sm:flex-row sm:items-center">

            <div className="max-w-2xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide">
                <Sparkles size={14} />
                JOINEAZY STUDENT PORTAL
              </div>

              <h1 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                Welcome back, {user?.name || "Student"}!
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-red-100 sm:text-base">
                Your learning journey continues here. Manage your assignments,
                track your progress and stay ahead of your deadlines.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-red-700">
                  <BookOpen size={17} />
                  My Learning Space
                </div>

                <span className="text-xs text-red-100">
                  Keep learning. Keep growing.
                </span>
              </div>
            </div>

            <div className="hidden shrink-0 items-center justify-center sm:flex">
              <div className="flex h-32 w-32 items-center justify-center rounded-full border border-white/20 bg-white/10">
                <GraduationCap size={76} strokeWidth={1.3} />
              </div>
            </div>

          </div>
        </section>

        {/* Dashboard Heading */}
        <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-red-700">
              Dashboard Overview
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-800">
              Your Academic Progress
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Keep track of your assignments and submissions.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <CalendarDays size={17} className="text-red-700" />
            Student Dashboard
          </div>
        </section>

        {/* Statistics Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <SummaryCard
            title="Total Assignments"
            value={myAssignments.length}
            subtitle="All assigned tasks"
            icon={<FileText size={23} />}
            iconClass="bg-red-50 text-red-700"
          />

          <SummaryCard
            title="Pending Assignments"
            value={pendingCount}
            subtitle="Waiting for submission"
            icon={<Clock size={23} />}
            iconClass="bg-amber-50 text-amber-600"
          />

          <SummaryCard
            title="Submitted Assignments"
            value={submittedCount}
            subtitle="Successfully completed"
            icon={<CheckCircle2 size={23} />}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <SummaryCard
            title="Completion Rate"
            value={`${completionPercentage}%`}
            subtitle="Your overall progress"
            icon={<TrendingUp size={23} />}
            iconClass="bg-blue-50 text-blue-600"
          />

        </section>

        {/* Progress Section */}
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

            <div>
              <h3 className="font-bold text-slate-800">
                Assignment Completion
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Your assignment submission progress.
              </p>
            </div>

            <span className="text-2xl font-bold text-red-700">
              {completionPercentage}%
            </span>

          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-linear-to-r from-red-800 to-red-500 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <div className="mt-3 flex justify-between text-xs text-slate-500">
            <span>{submittedCount} completed</span>
            <span>{pendingCount} remaining</span>
          </div>

        </section>

        {/* Assignments Section */}
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">

          {/* Header */}
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

              <div>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-red-50 p-2 text-red-700">
                    <ClipboardList size={20} />
                  </div>

                  <h2 className="text-xl font-bold text-slate-800">
                    My Assignments
                  </h2>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  View, manage and submit your academic assignments.
                </p>
              </div>

              <span className="w-fit rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-700">
                {myAssignments.length} Total Tasks
              </span>

            </div>

          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 gap-3 border-b border-slate-100 bg-slate-50/70 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:px-6">

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assignments..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Submitted">Submitted</option>
            </select>

            <div className="relative">
              <ArrowUpDown
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50"
              >
                <option value="dueDate">Sort by Due Date</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>

          </div>

          {/* Assignment List */}
          <div className="p-5 sm:p-6">

            {filteredAssignments.length === 0 ? (

              <div className="rounded-2xl border-2 border-dashed border-slate-200 px-4 py-14 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <ClipboardList size={32} />
                </div>

                <h3 className="mt-4 font-bold text-slate-800">
                  No Assignments Found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {myAssignments.length === 0
                    ? "You don't have any assignments assigned yet."
                    : "Try changing your search or filter."}
                </p>

              </div>

            ) : (

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

                {filteredAssignments.map((assignment) => {
                  const isSubmitted = Boolean(
                    assignment.submissions?.[user?.id]
                  );

                  const overdue =
                    !isSubmitted && isOverdue(assignment.dueDate);

                  return (
                    <article
                      key={assignment.id}
                      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg hover:shadow-red-50 sm:p-6"
                    >

                      {/* Card Top */}
                      <div className="flex items-start justify-between gap-3">

                        <div className="flex min-w-0 items-center gap-3">

                          <div className="shrink-0 rounded-xl bg-red-50 p-3 text-red-700 transition group-hover:bg-red-700 group-hover:text-white">
                            <FileText size={23} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="wrap-break-words font-bold text-slate-800">
                              {assignment.title || "Untitled Assignment"}
                            </h3>

                            <p className="mt-1 text-xs text-slate-400">
                              Academic Assignment
                            </p>
                          </div>

                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
                            isSubmitted
                              ? "bg-emerald-50 text-emerald-700"
                              : overdue
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {isSubmitted
                            ? "Submitted"
                            : overdue
                            ? "Overdue"
                            : "Pending"}
                        </span>

                      </div>

                      {/* Description */}
                      <p className="mt-5 line-clamp-3 min-h-15 text-sm leading-6 text-slate-500">
                        {assignment.description ||
                          "No description provided."}
                      </p>

                      {/* Date */}
                      <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-600">
                        <CalendarDays
                          size={17}
                          className="text-red-700"
                        />

                        <span className="font-medium">
                          Due Date:
                        </span>

                        <span>{formatDate(assignment.dueDate)}</span>
                      </div>

                      {/* Drive Link */}
                      {assignment.driveLink && (
                        <a
                          href={assignment.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex w-fit items-center gap-2 text-sm font-semibold text-red-700 transition hover:text-red-900"
                        >
                          View Assignment
                          <ExternalLink size={15} />
                        </a>
                      )}

                      {/* Footer */}
                      <div className="mt-auto border-t border-slate-100 pt-5">

                        {isSubmitted ? (

                          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                            <CheckCircle2 size={19} />
                            Assignment submitted successfully
                          </div>

                        ) : (

                          <button
                            onClick={() =>
                              setSelectedAssignment(assignment)
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-3 text-sm font-bold text-white shadow-md shadow-red-100 transition hover:bg-red-800 active:scale-[0.98]"
                          >
                            Mark as Submitted
                            <ArrowRight size={17} />
                          </button>

                        )}

                      </div>

                    </article>
                  );
                })}

              </div>

            )}

          </div>
        </section>

        {/* Bottom Note */}
        <div className="flex flex-col items-center justify-between gap-2 pb-4 text-center text-xs text-slate-400 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} Joineazy Student Portal</p>
          <p>Learn • Grow • Achieve</p>
        </div>

      </div>

      {/* Confirmation Modal */}
      {selectedAssignment && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-7">

            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-700">
                <CheckCircle2 size={25} />
              </div>

              <button
                onClick={() => setSelectedAssignment(null)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close confirmation"
              >
                <X size={21} />
              </button>

            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-800">
              Confirm Submission
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Have you completed{" "}
              <span className="font-bold text-slate-800">
                {selectedAssignment.title}
              </span>
              ? Confirm to update your assignment status.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">

              <button
                onClick={() => setSelectedAssignment(null)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="flex-1 rounded-xl bg-red-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-800"
              >
                Confirm Submission
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

// Reusable Summary Card
function SummaryCard({ title, value, subtitle, icon, iconClass }) {
  return (
    <div className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

      <div className="flex items-start justify-between gap-3">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-800">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            {subtitle}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${iconClass}`}>
          {icon}
        </div>

      </div>

    </div>
  );
}
