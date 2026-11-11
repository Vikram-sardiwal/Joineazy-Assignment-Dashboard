
import { useState } from "react";
import {
  BookOpen,
  Users,
  CheckCircle,
  Clock,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react";

import { users } from "../data/users";
import { useAssignments } from "../context/AppContext";
import AssignmentForm from "../components/AssignmentForm";

function AdminDashboard({ user }) {
  const {
    assignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
  } = useAssignments();

  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const myAssignments = assignments.filter(
    (assignment) => assignment.createdBy === user.id
  );

  const students = users.filter((u) => u.role === "Student");

  const totalStudents = new Set(
    myAssignments.flatMap((item) => item.assignedTo)
  ).size;

  const totalSubmissions = myAssignments.reduce(
    (total, item) =>
      total +
      Object.values(item.submissions).filter(Boolean).length,
    0
  );

  const totalPending = myAssignments.reduce(
    (total, item) =>
      total +
      Object.values(item.submissions).filter((value) => !value).length,
    0
  );

  const handleSave = (data) => {
    if (editingAssignment) {
      updateAssignment(editingAssignment.id, data);
    } else {
      addAssignment(data);
    }

    setShowForm(false);
    setEditingAssignment(null);
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (confirmed) {
      deleteAssignment(id);
    }
  };

  return (
    <div className="p-5 md:p-7 space-y-7">

      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Admin Overview
          </h1>
          <p className="text-slate-500 mt-1">
            Manage assignments and monitor student progress.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingAssignment(null);
            setShowForm(true);
          }}
          className="bg-indigo-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus size={19} />
          Create Assignment
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          title="My Assignments"
          value={myAssignments.length}
          icon={<BookOpen />}
        />

        <StatCard
          title="Students Assigned"
          value={totalStudents}
          icon={<Users />}
        />

        <StatCard
          title="Submitted"
          value={totalSubmissions}
          icon={<CheckCircle />}
        />

        <StatCard
          title="Pending"
          value={totalPending}
          icon={<Clock />}
        />

      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">
          Assignment Management
        </h2>

        {myAssignments.length === 0 ? (
          <div className="bg-white border rounded-2xl p-10 text-center">
            <BookOpen className="mx-auto text-slate-400" size={35} />
            <h3 className="font-bold mt-3">
              No assignments created
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Create your first assignment to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {myAssignments.map((assignment) => {
              const assignedStudents = students.filter(
                (student) =>
                  assignment.assignedTo.includes(student.id)
              );

              const completed = assignedStudents.filter(
                (student) =>
                  assignment.submissions[student.id]
              ).length;

              const percentage = assignedStudents.length
                ? Math.round(
                    (completed / assignedStudents.length) * 100
                  )
                : 0;

              return (
                <div
                  key={assignment.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5"
                >
                  <div className="flex flex-wrap justify-between gap-4">

                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-slate-900">
                        {assignment.title}
                      </h3>

                      <p className="text-sm text-slate-500 mt-2">
                        {assignment.description}
                      </p>

                      <p className="text-sm text-slate-500 mt-2">
                        Due Date: {assignment.dueDate}
                      </p>

                      <a
                        href={assignment.driveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 text-sm flex items-center gap-1 mt-2"
                      >
                        Open Drive Link <ExternalLink size={14} />
                      </a>
                    </div>

                    <div className="flex items-start gap-2">
                      <button
                        onClick={() => handleEdit(assignment)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                        aria-label="Edit assignment"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(assignment.id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        aria-label="Delete assignment"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold">
                        Class Completion
                      </span>

                      <span className="font-bold text-indigo-600">
                        {completed}/{assignedStudents.length} ({percentage}%)
                      </span>
                    </div>

                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold text-sm mb-3">
                      Student Submission Status
                    </h4>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-400 text-left">
                        <thead>
                          <tr className="text-xs text-slate-500 border-b">
                            <th className="pb-3">Student Name</th>
                            <th className="pb-3">Email</th>
                            <th className="pb-3">Status</th>
                          </tr>
                        </thead>

                        <tbody>
                          {assignedStudents.map((student) => {
                            const isSubmitted = Boolean(
                              assignment.submissions[student.id]
                            );

                            return (
                              <tr
                                key={student.id}
                                className="border-b last:border-0"
                              >
                                <td className="py-4 font-medium text-sm">
                                  {student.name}
                                </td>

                                <td className="py-4 text-sm text-slate-500">
                                  {student.email}
                                </td>

                                <td className="py-4">
                                  <span
                                    className={`text-xs px-3 py-1 rounded-full ${
                                      isSubmitted
                                        ? "bg-green-100 text-green-700"
                                        : "bg-orange-100 text-orange-700"
                                    }`}
                                  >
                                    {isSubmitted
                                      ? "Submitted"
                                      : "Not Submitted"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {showForm && (
        <AssignmentForm
          adminId={user.id}
          initialData={editingAssignment}
          onClose={() => {
            setShowForm(false);
            setEditingAssignment(null);
          }}
          onSave={handleSave}
        />
      )}

    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white border border-slate-200 p-5 rounded-2xl flex justify-between items-center">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <h2 className="text-3xl font-bold mt-2">{value}</h2>
      </div>

      <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl">
        {icon}
      </div>
    </div>
  );
}

export default AdminDashboard;
