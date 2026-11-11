import { useMemo, useState } from "react";
import {
  X,
  ClipboardList,
  Users,
  CalendarDays,
  Link as LinkIcon,
  CheckCircle2,
  UserCheck,
  Sparkles,
  UserRound,
  UserRoundGroup,
} from "lucide-react";

import { users } from "../data/users";

function AssignmentForm({
  onClose,
  onSave,
  initialData,
  adminId,
  courseId,
  availableStudentIds,
}) {
  const students = useMemo(() => {
    const allStudents = users.filter((user) => user.role === "Student");

    if (!availableStudentIds) return allStudents;

    return allStudents.filter((student) =>
      availableStudentIds.includes(student.id),
    );
  }, [availableStudentIds]);

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );

  const [deadline, setDeadline] = useState(
    initialData?.deadline ||
      (initialData?.dueDate ? `${initialData.dueDate}T23:59` : ""),
  );

  const [driveLink, setDriveLink] = useState(initialData?.driveLink || "");

  const [submissionType, setSubmissionType] = useState(
    initialData?.submissionType || "Individual",
  );

  const [assignAll, setAssignAll] = useState(
    initialData
      ? students.length > 0 &&
          students.every((student) =>
            initialData.assignedTo?.includes(student.id),
          )
      : true,
  );

  const [selectedStudents, setSelectedStudents] = useState(
    initialData?.assignedTo || students.map((student) => student.id),
  );

  const [error, setError] = useState("");

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50";

  const toggleStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((studentId) => studentId !== id)
        : [...prev, id],
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const assignedTo = assignAll
      ? students.map((student) => student.id)
      : selectedStudents.filter((id) =>
          students.some((student) => student.id === id),
        );

    if (!title.trim() || !description.trim()) {
      setError("Please fill in all required assignment details.");
      return;
    }

    if (!deadline) {
      setError("Please select a deadline date and time.");
      return;
    }

    if (!driveLink.trim()) {
      setError("Please provide an assignment resource link.");
      return;
    }

    if (!/^https?:\/\/.+/i.test(driveLink.trim())) {
      setError("Please enter a valid HTTP or HTTPS resource link.");
      return;
    }

    if (new Date(deadline).getTime() <= Date.now()) {
      setError("Please select a future deadline.");
      return;
    }

    if (assignedTo.length === 0) {
      setError("Please select at least one student.");
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      deadline,
      dueDate: deadline.split("T")[0],
      driveLink: driveLink.trim(),
      submissionType,
      courseId: Number(courseId ?? initialData?.courseId),
      createdBy: adminId ?? initialData?.createdBy,
      assignedTo,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:p-4">
      <div className="flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[92vh] sm:max-w-2xl sm:rounded-3xl">
        {/* Header */}
        <div className="relative shrink-0 overflow-hidden bg-linear-to-r from-indigo-800 via-indigo-700 to-violet-600 px-5 py-6 text-white sm:px-7">
          <div className="pointer-events-none absolute -right-8 -top-16 h-40 w-40 rounded-full border-22 border-white/10" />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-3">
                <ClipboardList size={25} />
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-100">
                  <Sparkles size={13} />
                  Joineazy Professor Portal
                </div>

                <h2 className="text-xl font-bold sm:text-2xl">
                  {initialData ? "Edit Assignment" : "Create Assignment"}
                </h2>

                <p className="mt-1 text-xs text-indigo-100 sm:text-sm">
                  Manage academic tasks for your students
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-xl border border-white/20 bg-white/10 p-2.5 transition hover:bg-white/20"
              aria-label="Close form"
            >
              <X size={21} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-6 overflow-y-auto bg-slate-50 p-5 sm:p-7">
            {/* Assignment details */}
            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-700">
                  <ClipboardList size={20} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-800">
                    Assignment Details
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Enter assignment information
                  </p>
                </div>
              </div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Assignment Title *
              </label>

              <input
                required
                maxLength={100}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. React JS Final Project"
                className={inputClass}
              />

              <label className="mb-2 mt-5 block text-sm font-semibold text-slate-700">
                Description *
              </label>

              <textarea
                required
                rows={4}
                maxLength={1000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write assignment instructions and details..."
                className={`${inputClass} resize-none`}
              />
            </section>

            {/* Deadline and link */}
            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-700">
                  <CalendarDays size={20} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-800">
                    Deadline & Resources
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Set deadline and assignment resource link
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <CalendarDays size={16} className="text-indigo-700" />
                    Deadline Date & Time *
                  </label>

                  <input
                    required
                    type="datetime-local"
                    min={new Date(
                      Date.now() - new Date().getTimezoneOffset() * 60000,
                    )
                      .toISOString()
                      .slice(0, 16)}
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <LinkIcon size={16} className="text-indigo-700" />
                    OneDrive / Google Drive Link *
                  </label>

                  <input
                    required
                    type="url"
                    value={driveLink}
                    onChange={(e) => setDriveLink(e.target.value)}
                    placeholder="https://..."
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-xl bg-indigo-50 p-3 text-xs leading-5 text-indigo-700">
                <LinkIcon size={15} className="mt-0.5 shrink-0" />
                <p>
                  Ensure your resource link has sharing permissions so students
                  can access it.
                </p>
              </div>
            </section>

            {/* Submission type */}
            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h3 className="font-bold text-slate-800">Submission Type</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Choose how students will submit this assignment
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    value: "Individual",
                    label: "Individual Submission",
                    description: "Each student acknowledges separately.",
                    Icon: UserRound,
                  },
                  {
                    value: "Group",
                    label: "Group Submission",
                    description: "Only the group leader acknowledges.",
                    Icon: Users,
                  },
                ].map(({ value, label, description, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSubmissionType(value)}
                    className={`rounded-xl border p-4 text-left transition ${
                      submissionType === value
                        ? "border-indigo-400 bg-indigo-50 ring-2 ring-indigo-100"
                        : "border-slate-200 hover:border-indigo-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon size={22} className="text-indigo-700" />
                      {submissionType === value && (
                        <CheckCircle2 size={19} className="text-indigo-700" />
                      )}
                    </div>

                    <p className="mt-3 text-sm font-bold text-slate-800">
                      {label}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {description}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            {/* Student selection */}
            <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 p-5 sm:px-6">
                <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-700">
                  <Users size={20} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-800">Assign Students</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Choose students enrolled in this course
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-indigo-200">
                  <input
                    type="checkbox"
                    checked={assignAll}
                    onChange={(e) => setAssignAll(e.target.checked)}
                    className="h-4 w-4 accent-indigo-700"
                  />

                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="rounded-lg bg-indigo-50 p-2 text-indigo-700">
                      <Users size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Assign to All Course Students
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Send assignment to everyone enrolled in this course
                      </p>
                    </div>
                  </div>

                  {assignAll && (
                    <CheckCircle2
                      size={20}
                      className="shrink-0 text-indigo-700"
                    />
                  )}
                </label>

                {!assignAll && (
                  <div className="mt-5">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Select Students
                      </p>

                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                        {
                          selectedStudents.filter((id) =>
                            students.some((student) => student.id === id),
                          ).length
                        }{" "}
                        Selected
                      </span>
                    </div>

                    {students.length === 0 ? (
                      <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                        No students enrolled in this course.
                      </p>
                    ) : (
                      <div className="grid max-h-52 grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
                        {students.map((student) => {
                          const isSelected = selectedStudents.includes(
                            student.id,
                          );

                          return (
                            <label
                              key={student.id}
                              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                                isSelected
                                  ? "border-indigo-300 bg-indigo-50"
                                  : "border-slate-200 hover:border-indigo-200"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleStudent(student.id)}
                                className="h-4 w-4 accent-indigo-700"
                              />

                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                                {student.name?.charAt(0)?.toUpperCase() || "S"}
                              </div>

                              <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
                                {student.name}
                              </span>

                              {isSelected && (
                                <CheckCircle2
                                  size={17}
                                  className="shrink-0 text-indigo-700"
                                />
                              )}
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-5 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs font-medium text-slate-500">
                  <UserCheck size={16} className="shrink-0 text-indigo-700" />
                  {assignAll
                    ? `All ${students.length} enrolled students will receive this assignment.`
                    : `${
                        selectedStudents.filter((id) =>
                          students.some((student) => student.id === id),
                        ).length
                      } students selected.`}
                </div>
              </div>
            </section>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
              >
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-slate-100 bg-white p-5 sm:px-7">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-800 active:scale-[0.98] sm:w-auto"
              >
                <CheckCircle2 size={18} />
                {initialData ? "Update Assignment" : "Create Assignment"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssignmentForm;
