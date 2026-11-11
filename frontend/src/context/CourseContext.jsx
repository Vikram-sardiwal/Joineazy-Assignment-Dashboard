
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CourseContext = createContext(null);

const STORAGE_KEY = "joineazy_round2_courses";

const initialCourses = [
  {
    id: 101,
    title: "React & Frontend Development",
    code: "FE101",
    description: "Learn React, components, hooks and responsive UI development.",
    professorId: 1,
    studentIds: [3, 4, 5, 6, 7],
  },
  {
    id: 102,
    title: "JavaScript Programming",
    code: "JS102",
    description: "Learn JavaScript fundamentals, ES6 and asynchronous programming.",
    professorId: 2,
    studentIds: [3, 4, 5],
  },
  {
    id: 103,
    title: "Full Stack Web Development",
    code: "FS103",
    description: "Build full-stack applications using Node.js and MongoDB.",
    professorId: 1,
    studentIds: [3, 6, 7],
  },
];

function getSavedCourses() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialCourses;
  } catch (error) {
    console.error("Error loading courses:", error);
    return initialCourses;
  }
}

export function CourseProvider({ children }) {
  const [courses, setCourses] = useState(getSavedCourses);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  }, [courses]);

  // Professor creates a course
  const addCourse = (courseData) => {
    const newCourse = {
      ...courseData,
      id: Date.now(),
      studentIds: courseData.studentIds || [],
    };

    setCourses((prev) => [...prev, newCourse]);
    return newCourse;
  };

  // Professor updates a course
  const updateCourse = (courseId, updatedData) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId
          ? { ...course, ...updatedData }
          : course
      )
    );
  };

  // Professor deletes a course
  const deleteCourse = (courseId) => {
    setCourses((prev) =>
      prev.filter((course) => course.id !== courseId)
    );
  };

  // Add student to a course
  const enrollStudent = (courseId, studentId) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId &&
        !course.studentIds.includes(studentId)
          ? {
              ...course,
              studentIds: [...course.studentIds, studentId],
            }
          : course
      )
    );
  };

  // Remove student from a course
  const removeStudent = (courseId, studentId) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId
          ? {
              ...course,
              studentIds: course.studentIds.filter(
                (id) => id !== studentId
              ),
            }
          : course
      )
    );
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        enrollStudent,
        removeStudent,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CourseContext);

  if (!context) {
    throw new Error("useCourses must be used inside CourseProvider");
  }

  return context;
}
