
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Users,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  CalendarDays,
  CheckCircle2,
  FileText,
  Clock,
  Crown,
} from "lucide-react";

import { useCourses } from "../context/CourseContext";
import { useAssignments } from "../context/AppContext";
import { useGroups } from "../context/GroupContext";

import { users } from "../data/users";
import AssignmentForm from "../components/AssignmentForm";
import GroupManagement from "../components/GroupManagement";

function CourseDetails({ user }) {
  const { courseId } = useParams();

  const { courses } = useCourses();

  const {
    assignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    submitAssignment,
    acknowledgeGroupAssignment,
  } = useAssignments();

  const { getUserGroup } = useGroups();

  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedGroupAssignment, setSelectedGroupAssignment] =
    useState(null);

  const course = courses.find(
    (item) => item.id === Number(courseId)
  );

  const isStudent = user.role === "Student";

  const hasAccess =
    course &&
    (isStudent
      ? course.studentIds.includes(user.id)
      : course.professorId === user.id);

  const userGroup =
    course && isStudent
      ? getUserGroup(course.id, user.id)
      : null;

  if (!hasAccess) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800">
          Course not found
        </h2>

        <p className="mt-2 text-slate-500">
          You don't have access to this course.
        </p>

        <Link
          to="/dashboard"
          className="mt-5 inline-flex font-semibold text-indigo-600"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const courseAssignments = assignments.filter((assignment) => {
    const belongsToCourse =
      Number(assignment.courseId) === course.id;

    if (isStudent) {
      return (
        belongsToCourse &&
        assignment.assignedTo?.includes(user.id)
      );
    }

    return (
      belongsToCourse &&
      assignment.createdBy === user.id
    );
  });

  const students = users.filter(
    (student) =>
      student.role === "Student" &&
      course.studentIds.includes(student.id)
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

  const handleSubmit = () => {
    if (!selectedAssignment) return;

    submitAssignment(
      selectedAssignment.id,
      user.id,
      user.name
    );

    setSelectedAssignment(null);
  };

  const handleGroupSubmit = () => {
    if (!selectedGroupAssignment || !userGroup) return;

    if (Number(userGroup.leaderId) !== Number(user.id)) {
      return;
    }

    acknowledgeGroupAssignment(
      selectedGroupAssignment.id,
      userGroup.id,
      user.id,
      user.name
    );

    setSelectedGroupAssignment(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "No deadline";
    }

    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getGroupAcknowledgement = (assignment, groupId) => {
    if (!groupId) return null;

    return (
      assignment.groupAcknowledgements?.[groupId] ||
      (Number(assignment.groupAcknowledgement?.groupId) ===
      Number(groupId)
        ? assignment.groupAcknowledgement
        : null)
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-5 md:p-8">
      {/* Back Button */}
      <Link
        to="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
      >
        <ArrowLeft size={18} />
        Back to Courses
      </Link>

      {/* Course Information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          {course.code}
        </span>

        <h1 className="mt-4 text-2xl font-bold text-slate-800 md:text-3xl">
          {course.title}
        </h1>

        <p className="mt-3 max-w-2xl text-slate-500">
          {course.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-indigo-600" />
            {course.studentIds.length} Students
          </div>

          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-indigo-600" />
            {isStudent ? "Student View" : "Professor View"}
          </div>
        </div>
      </div>

      {/* Assignments Header */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Course Assignments
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {isStudent
              ? "View and submit your course assignments."
              : "Create assignments and monitor student submissions."}
          </p>
        </div>

        {!isStudent && (
          <button
            onClick={() => {
              setEditingAssignment(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <Plus size={18} />
            Create Assignment
          </button>
        )}
      </div>

      {/* Assignment List */}
      <div className="mt-6 space-y-5">
        {courseAssignments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <BookOpen
              size={38}
              className="mx-auto text-slate-400"
            />

            <h3 className="mt-4 font-bold text-slate-800">
              No Assignments Found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {isStudent
                ? "No assignments have been assigned to you yet."
                : "Create your first assignment for this course."}
            </p>
          </div>
        ) : (
          courseAssignments.map((assignment) => {
            const isGroup =
              assignment.submissionType === "Group";

            const assignedStudents = students.filter((student) =>
              assignment.assignedTo?.includes(student.id)
            );

            // Calculate group-aware submission progress
            const studentStatuses = assignedStudents.map(
              (student) => {
                if (!isGroup) {
                  return {
                    student,
                    done: Boolean(
                      assignment.submissions?.[student.id]
                    ),
                  };
                }

                const studentGroup = getUserGroup(
                  course.id,
                  student.id
                );

                const groupAcknowledgement = studentGroup
                  ? getGroupAcknowledgement(
                      assignment,
                      studentGroup.id
                    )
                  : null;

                return {
                  student,
                  done: Boolean(groupAcknowledgement),
                };
              }
            );

            const submittedCount = studentStatuses.filter(
              (item) => item.done
            ).length;

            const assignedCount = assignedStudents.length;

            const percentage = assignedCount
              ? Math.round(
                  (submittedCount / assignedCount) * 100
                )
              : 0;

            const isSubmitted = Boolean(
              assignment.submissions?.[user.id]
            );

            const currentGroupAcknowledgement =
              userGroup && isGroup
                ? getGroupAcknowledgement(
                    assignment,
                    userGroup.id
                  )
                : null;

            const isGroupLeader =
              userGroup &&
              Number(userGroup.leaderId) === Number(user.id);

            return (
              <article
                key={assignment.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md md:p-6"
              >
                {/* Assignment Information */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 gap-3">
                    <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                      <FileText size={23} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-slate-800">
                        {assignment.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {assignment.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays size={14} />
                          {formatDate(
                            assignment.deadline ||
                              assignment.dueDate
                          )}
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">
                          {assignment.submissionType || "Individual"}
                        </span>
                      </div>

                      {assignment.driveLink && (
                        <a
                          href={assignment.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          Open Assignment
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Professor Actions */}
                  {!isStudent && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(assignment)}
                        className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                        aria-label="Edit assignment"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(assignment.id)
                        }
                        className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                        aria-label="Delete assignment"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Professor Submission Progress */}
                {!isStudent && (
                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-slate-700">
                        {isGroup
                          ? "Group Submission Progress"
                          : "Student Submission Progress"}
                      </span>

                      <span className="font-bold text-indigo-600">
                        {submittedCount}/{assignedCount} ({percentage}%)
                      </span>
                    </div>

                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="mt-5 overflow-x-auto">
                      <table className="w-full min-w-112.5 text-left">
                        <thead>
                          <tr className="border-b text-xs text-slate-500">
                            <th className="pb-3">Student</th>
                            <th className="pb-3">Email</th>
                            <th className="pb-3">Status</th>
                          </tr>
                        </thead>

                        <tbody>
                          {studentStatuses.map(({ student, done }) => (
                            <tr
                              key={student.id}
                              className="border-b last:border-0"
                            >
                              <td className="py-3 text-sm font-medium text-slate-700">
                                {student.name}
                              </td>

                              <td className="py-3 text-sm text-slate-500">
                                {student.email}
                              </td>

                              <td className="py-3">
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    done
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-amber-50 text-amber-700"
                                  }`}
                                >
                                  {done ? "Submitted" : "Pending"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Student Submission */}
                {isStudent && (
                  <div className="mt-6 border-t border-slate-100 pt-5">
                    {isGroup ? (
                      <div className="space-y-4">
                        {!userGroup && (
                          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                            <div className="flex items-center gap-2 font-semibold text-blue-800">
                              <Users size={18} />
                              Group Submission
                            </div>

                            <p className="mt-2 text-sm text-blue-700">
                              You are not part of any group. Create or join one to submit this assignment.
                            </p>
                          </div>
                        )}

                        <GroupManagement
                          courseId={course.id}
                          user={user}
                        />

                        {userGroup && (
                          <div className="rounded-xl border border-slate-200 p-4">
                            {currentGroupAcknowledgement ? (
                              <div className="flex items-start gap-3">
                                <CheckCircle2
                                  size={22}
                                  className="mt-0.5 text-emerald-600"
                                />

                                <div>
                                  <h4 className="font-bold text-emerald-700">
                                    Group Assignment Submitted
                                  </h4>

                                  <p className="mt-2 text-sm text-slate-600">
                                    Acknowledged by{" "}
                                    <strong>
                                      {currentGroupAcknowledgement.leaderName}
                                    </strong>{" "}
                                    on{" "}
                                    {formatDate(
                                      currentGroupAcknowledgement.submittedAt
                                    )}
                                  </p>
                                </div>
                              </div>
                            ) : isGroupLeader ? (
                              <div>
                                <div className="flex items-center gap-2 font-semibold text-slate-800">
                                  <Crown
                                    size={19}
                                    className="text-amber-500"
                                  />
                                  You are the Group Leader
                                </div>

                                <p className="mt-2 text-sm text-slate-500">
                                  Once your group has completed the assignment, acknowledge submission for all group members.
                                </p>

                                <button
                                  onClick={() =>
                                    setSelectedGroupAssignment(
                                      assignment
                                    )
                                  }
                                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                >
                                  <CheckCircle2 size={18} />
                                  Acknowledge Submission
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-start gap-3">
                                <Clock
                                  size={21}
                                  className="mt-0.5 text-amber-500"
                                />

                                <div>
                                  <h4 className="font-semibold text-slate-800">
                                    Waiting for Group Leader
                                  </h4>

                                  <p className="mt-1 text-sm text-slate-500">
                                    Your group leader,{" "}
                                    <strong>
                                      {userGroup.leaderName}
                                    </strong>
                                    , will acknowledge the assignment submission.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : isSubmitted ? (
                      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-emerald-700">
                        <CheckCircle2 size={19} />
                        Assignment submitted successfully

                        {assignment.acknowledgementDetails?.[user.id]
                          ?.submittedAt && (
                          <span className="font-normal text-slate-500">
                            on{" "}
                            {formatDate(
                              assignment.acknowledgementDetails[
                                user.id
                              ].submittedAt
                            )}
                          </span>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          setSelectedAssignment(assignment)
                        }
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                      >
                        <CheckCircle2 size={18} />
                        Yes, I have submitted
                      </button>
                    )}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Assignment Form */}
      {showForm && (
        <AssignmentForm
          adminId={user.id}
          courseId={course.id}
          availableStudentIds={course.studentIds}
          initialData={editingAssignment}
          onClose={() => {
            setShowForm(false);
            setEditingAssignment(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* Individual Submission Confirmation */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={25} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-800">
              Confirm Submission
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Have you completed{" "}
              <strong className="text-slate-800">
                {selectedAssignment.title}
              </strong>
              ? Confirm your submission.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                onClick={() => setSelectedAssignment(null)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Group Submission Confirmation */}
      {selectedGroupAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Users size={25} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-800">
              Confirm Group Submission
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Are you sure your group has completed{" "}
              <strong className="text-slate-800">
                {selectedGroupAssignment.title}
              </strong>
              ? Your acknowledgement will mark the assignment as submitted for your group.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                onClick={() => setSelectedGroupAssignment(null)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleGroupSubmit}
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
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

export default CourseDetails;
