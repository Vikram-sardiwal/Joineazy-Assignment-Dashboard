
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { useCourses } from "../context/CourseContext";

function CoursesDashboard({ user }) {
  const { courses } = useCourses();

  const userCourses =
    user.role === "Student"
      ? courses.filter((course) =>
          course.studentIds.includes(user.id)
        )
      : courses.filter(
          (course) => course.professorId === user.id
        );

  return (
    <div className="p-5 md:p-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-indigo-600">
          {user.role === "Student"
            ? "Student Portal"
            : "Professor Portal"}
        </p>

        <h1 className="mt-2 text-2xl md:text-3xl font-bold text-slate-800">
          Welcome, {user.name}!
        </h1>

        <p className="mt-2 text-slate-500">
          {user.role === "Student"
            ? "Explore your enrolled courses and assignments."
            : "Manage your courses and track student progress."}
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">
          My Courses
        </h2>

        <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
          {userCourses.length} Courses
        </span>
      </div>

      {userCourses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <GraduationCap
            size={42}
            className="mx-auto text-slate-400"
          />
          <h3 className="mt-4 text-lg font-semibold text-slate-700">
            No courses available
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Your courses will appear here when they are available.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {userCourses.map((course) => (
            <div
              key={course.id}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                  <BookOpen size={24} />
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {course.code}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                {course.title}
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                {course.description}
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                <Users size={17} />
                <span>
                  {course.studentIds.length} Students
                </span>
              </div>

              <Link
                to={`/courses/${course.id}`}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                View Course
                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CoursesDashboard;
