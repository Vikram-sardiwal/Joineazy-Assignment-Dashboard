
import { useState } from "react";
import {
  X,
  ClipboardList,
  Users,
  CalendarDays,
  Link as LinkIcon,
  CheckCircle2,
  UserCheck,
  Sparkles,
} from "lucide-react";

import { users } from "../data/users";

function AssignmentForm({ onClose, onSave, initialData, adminId }) {
  const students = users.filter(
    (user) => user.role === "Student"
  );

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate || ""
  );
  const [driveLink, setDriveLink] = useState(
    initialData?.driveLink || ""
  );

  const [assignAll, setAssignAll] = useState(
    initialData
      ? (initialData.assignedTo?.length || 0) === students.length
      : true
  );

  const [selectedStudents, setSelectedStudents] = useState(
    initialData?.assignedTo || students.map((student) => student.id)
  );

  const toggleStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((studentId) => studentId !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const assignedTo = assignAll
      ? students.map((student) => student.id)
      : selectedStudents;

    if (assignedTo.length === 0) {
      alert("Please select at least one student.");
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      driveLink: driveLink.trim(),
      createdBy: adminId,
      assignedTo,
    });
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-50";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:p-4">

      <div className="flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[92vh] sm:max-w-2xl sm:rounded-3xl">

        {/* Header */}
        <div className="relative shrink-0 overflow-hidden bg-linear-to-r from-red-800 via-red-700 to-rose-600 px-5 py-6 text-white sm:px-7">

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-8 -top-16 h-40 w-40 rounded-full border-22 border-white/10" />
          <div className="pointer-events-none absolute -bottom-16 right-32 h-32 w-32 rounded-full bg-white/5" />

          <div className="relative z-10 flex items-center justify-between gap-3">

            <div className="flex items-center gap-3">

              <div className="rounded-2xl border border-white/20 bg-white/10 p-3">
                <ClipboardList size={25} />
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-100">
                  <Sparkles size={13} />
                  Joineazy Admin Portal
                </div>

                <h2 className="text-xl font-bold sm:text-2xl">
                  {initialData
                    ? "Edit Assignment"
                    : "Create Assignment"}
                </h2>

                <p className="mt-1 text-xs text-red-100 sm:text-sm">
                  Manage academic tasks for your students
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-xl border border-white/20 bg-white/10 p-2.5 text-white transition hover:bg-white/20"
              aria-label="Close form"
            >
              <X size={21} />
            </button>

          </div>
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >

          <div className="flex-1 space-y-6 overflow-y-auto bg-[#f8f9fc] p-5 sm:p-7">

            {/* Basic Details */}
            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">

                <div className="rounded-xl bg-red-50 p-2.5 text-red-700">
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

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Assignment Title <span className="text-red-600">*</span>
                </label>

                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. React JS Final Project"
                  className={inputClass}
                />
              </div>

              {/* Description */}
              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description <span className="text-red-600">*</span>
                </label>

                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write assignment instructions and details..."
                  className={`${inputClass} resize-none`}
                />
              </div>

            </section>

            {/* Date and Drive Link */}
            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">

                <div className="rounded-xl bg-red-50 p-2.5 text-red-700">
                  <CalendarDays size={20} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-800">
                    Deadline & Resources
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    Set the due date and add assignment link
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                {/* Due Date */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <CalendarDays size={16} className="text-red-700" />
                    Due Date <span className="text-red-600">*</span>
                  </label>

                  <input
                    required
                    type="date"
                    min={new Date().toLocaleDateString("en-CA")}
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* Drive Link */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <LinkIcon size={16} className="text-red-700" />
                    Google Drive Link <span className="text-red-600">*</span>
                  </label>

                  <input
                    required
                    type="url"
                    value={driveLink}
                    onChange={(e) => setDriveLink(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className={inputClass}
                  />
                </div>

              </div>

              <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs leading-5 text-red-700">
                <LinkIcon size={15} className="mt-0.5 shrink-0" />
                <p>
                  Make sure your Google Drive link has the correct sharing
                  permissions so students can access it.
                </p>
              </div>

            </section>

            {/* Student Selection */}
            <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">

              <div className="flex items-center gap-3 border-b border-slate-100 p-5 sm:px-6">

                <div className="rounded-xl bg-red-50 p-2.5 text-red-700">
                  <Users size={20} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-800">
                    Assign Students
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    Choose who will receive this assignment
                  </p>
                </div>

              </div>

              <div className="p-5 sm:p-6">

                {/* Assign All Option */}
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                    assignAll
                      ? "border-red-300 bg-red-50"
                      : "border-slate-200 bg-white hover:border-red-200"
                  }`}
                >

                  <input
                    type="checkbox"
                    checked={assignAll}
                    onChange={(e) => setAssignAll(e.target.checked)}
                    className="h-4 w-4 accent-red-700"
                  />

                  <div className="flex min-w-0 flex-1 items-center gap-3">

                    <div className="rounded-lg bg-white p-2 text-red-700 shadow-sm">
                      <Users size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Assign to All Students
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Send this assignment to everyone
                      </p>
                    </div>

                  </div>

                  {assignAll && (
                    <CheckCircle2
                      size={20}
                      className="shrink-0 text-red-700"
                    />
                  )}

                </label>

                {/* Individual Students */}
                {!assignAll && (

                  <div className="mt-5">

                    <div className="mb-3 flex items-center justify-between gap-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Select Individual Students
                      </p>

                      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                        {selectedStudents.length} Selected
                      </span>
                    </div>

                    {students.length === 0 ? (

                      <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                        No students available.
                      </p>

                    ) : (

                      <div className="grid max-h-52 grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">

                        {students.map((student) => {
                          const isSelected = selectedStudents.includes(
                            student.id
                          );

                          return (
                            <label
                              key={student.id}
                              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                                isSelected
                                  ? "border-red-300 bg-red-50"
                                  : "border-slate-200 bg-white hover:border-red-200"
                              }`}
                            >

                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleStudent(student.id)}
                                className="h-4 w-4 accent-red-700"
                              />

                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700">
                                {student.name?.charAt(0)?.toUpperCase() || "S"}
                              </div>

                              <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
                                {student.name}
                              </span>

                              {isSelected && (
                                <CheckCircle2
                                  size={17}
                                  className="shrink-0 text-red-700"
                                />
                              )}

                            </label>
                          );
                        })}

                      </div>
                    )}

                  </div>

                )}

                {/* Selection Summary */}
                <div className="mt-5 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs font-medium text-slate-500">
                  <UserCheck size={16} className="shrink-0 text-red-700" />

                  {assignAll
                    ? `All ${students.length} students will receive this assignment.`
                    : `${selectedStudents.length} students selected.`}
                </div>

              </div>
            </section>

          </div>

          {/* Footer Buttons */}
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
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-100 transition hover:bg-red-800 active:scale-[0.98] sm:w-auto"
              >
                <CheckCircle2 size={18} />

                {initialData
                  ? "Update Assignment"
                  : "Create Assignment"}
              </button>

            </div>

          </div>

        </form>
      </div>
    </div>
  );
}

export default AssignmentForm;
