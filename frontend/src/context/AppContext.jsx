import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext(null);

const STORAGE_KEY = "joineazy_assignments";

const initialAssignments = [
  {
    id: 1,
    courseId: 101,
    title: "React.js Fundamentals",
    description:
      "Build a responsive application using React components and hooks.",
    dueDate: "2026-11-05",
    deadline: "2026-11-05T23:59",
    driveLink: "https://drive.google.com/",
    submissionType: "Individual",
    createdBy: 1,
    assignedTo: [3, 4, 5, 6, 7],
    submissions: {
      3: true,
      4: false,
      5: true,
      6: false,
      7: false,
    },
    acknowledgementDetails: {},
    groupAcknowledgements: {},
  },
  {
    id: 2,
    courseId: 102,
    title: "JavaScript ES6 Project",
    description: "Practice modern JavaScript concepts and array methods.",
    dueDate: "2026-11-07",
    deadline: "2026-11-07T23:59",
    driveLink: "https://drive.google.com/",
    submissionType: "Individual",
    createdBy: 2,
    assignedTo: [3, 4, 5],
    submissions: {
      3: false,
      4: true,
      5: false,
    },
    acknowledgementDetails: {},
    groupAcknowledgements: {},
  },
];

// Convert old assignment data into the latest format
const normalizeAssignment = (assignment) => {
  const assignedTo = assignment.assignedTo || [];

  const oldGroupAcknowledgement = assignment.groupAcknowledgement || null;

  const groupAcknowledgements =
    assignment.groupAcknowledgements ||
    (oldGroupAcknowledgement?.groupId
      ? {
          [oldGroupAcknowledgement.groupId]: oldGroupAcknowledgement,
        }
      : {});

  return {
    ...assignment,

    courseId:
      assignment.courseId ??
      (assignment.id === 1 ? 101 : assignment.id === 2 ? 102 : null),

    deadline:
      assignment.deadline || `${assignment.dueDate || "2026-11-12"}T23:59`,

    submissionType: assignment.submissionType || "Individual",

    assignedTo,

    submissions: assignment.submissions || {},

    acknowledgementDetails: assignment.acknowledgementDetails || {},

    groupAcknowledgements,
  };
};

// Load assignments from localStorage
const getSavedAssignments = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return initialAssignments;
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return initialAssignments;
    }

    return parsed.map(normalizeAssignment);
  } catch (error) {
    console.error("Error loading assignments:", error);
    return initialAssignments;
  }
};

export function AppProvider({ children }) {
  const [assignments, setAssignments] = useState(getSavedAssignments);

  // Automatically save assignments
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    } catch (error) {
      console.error("Error saving assignments:", error);
    }
  }, [assignments]);

  // Add new assignment
  const addAssignment = (assignment) => {
    const assignedTo = assignment.assignedTo || [];

    const newAssignment = {
      ...assignment,

      id: Date.now(),

      deadline:
        assignment.deadline || `${assignment.dueDate || "2026-11-12"}T23:59`,

      submissionType: assignment.submissionType || "Individual",

      assignedTo,

      submissions: Object.fromEntries(
        assignedTo.map((studentId) => [studentId, false]),
      ),

      acknowledgementDetails: {},

      groupAcknowledgements: {},
    };

    setAssignments((prev) => [...prev, newAssignment]);

    return newAssignment;
  };

  // Update existing assignment
  const updateAssignment = (id, updatedData) => {
    setAssignments((prev) =>
      prev.map((assignment) => {
        if (assignment.id !== id) {
          return assignment;
        }

        const newAssignedTo = updatedData.assignedTo ?? assignment.assignedTo;

        const newSubmissions = Object.fromEntries(
          newAssignedTo.map((studentId) => [
            studentId,
            assignment.submissions?.[studentId] ?? false,
          ]),
        );

        const groupAcknowledgements =
          assignment.groupAcknowledgements ||
          (assignment.groupAcknowledgement?.groupId
            ? {
                [assignment.groupAcknowledgement.groupId]:
                  assignment.groupAcknowledgement,
              }
            : {});

        return {
          ...assignment,
          ...updatedData,

          assignedTo: newAssignedTo,

          submissions: newSubmissions,

          acknowledgementDetails: assignment.acknowledgementDetails || {},

          groupAcknowledgements,
        };
      }),
    );
  };

  // Delete assignment
  const deleteAssignment = (id) => {
    setAssignments((prev) => prev.filter((assignment) => assignment.id !== id));
  };

  // Individual assignment submission
  const submitAssignment = (
    assignmentId,
    studentId,
    studentName = "Student",
  ) => {
    setAssignments((prev) =>
      prev.map((assignment) => {
        if (assignment.id !== assignmentId) {
          return assignment;
        }

        if (
          assignment.submissions?.[studentId] ||
          assignment.submissionType === "Group"
        ) {
          return assignment;
        }

        const submittedAt = new Date().toISOString();

        return {
          ...assignment,

          submissions: {
            ...assignment.submissions,
            [studentId]: true,
          },

          acknowledgementDetails: {
            ...assignment.acknowledgementDetails,

            [studentId]: {
              submittedAt,
              submittedBy: studentName,
            },
          },
        };
      }),
    );
  };

  // Group assignment submission by group leader
  const acknowledgeGroupAssignment = (
    assignmentId,
    groupId,
    leaderId,
    leaderName,
  ) => {
    if (!groupId || !leaderId || !leaderName) {
      return false;
    }

    setAssignments((prev) =>
      prev.map((assignment) => {
        if (assignment.id !== assignmentId) {
          return assignment;
        }

        if (assignment.submissionType !== "Group") {
          return assignment;
        }

        const existingAcknowledgements =
          assignment.groupAcknowledgements ||
          (assignment.groupAcknowledgement?.groupId
            ? {
                [assignment.groupAcknowledgement.groupId]:
                  assignment.groupAcknowledgement,
              }
            : {});

        // Prevent duplicate acknowledgement for the same group
        if (existingAcknowledgements[groupId]) {
          return assignment;
        }

        return {
          ...assignment,

          groupAcknowledgements: {
            ...existingAcknowledgements,

            [groupId]: {
              groupId,
              leaderId,
              leaderName,
              submittedAt: new Date().toISOString(),
            },
          },
        };
      }),
    );

    return true;
  };

  return (
    <AppContext.Provider
      value={{
        assignments,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        submitAssignment,
        acknowledgeGroupAssignment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAssignments() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAssignments must be used inside AppProvider");
  }

  return context;
}
