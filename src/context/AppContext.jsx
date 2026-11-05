
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AppContext = createContext(null);

const STORAGE_KEY = "joineazy_assignments";

const initialAssignments = [
  {
    id: 1,
    title: "React.js Fundamentals",
    description:
      "Build a responsive application using React components and hooks.",
    dueDate: "2026-11-05",
    driveLink: "https://drive.google.com/",
    createdBy: 1,
    assignedTo: [3, 4, 5, 6, 7],
    submissions: {
      3: true,
      4: false,
      5: true,
      6: false,
      7: false,
    },
  },
  {
    id: 2,
    title: "JavaScript ES6 Project",
    description:
      "Practice modern JavaScript concepts and array methods.",
    dueDate: "2026-11-07",
    driveLink: "https://drive.google.com/",
    createdBy: 2,
    assignedTo: [3, 4, 5],
    submissions: {
      3: false,
      4: true,
      5: false,
    },
  },
];

// Read assignments from localStorage
const getSavedAssignments = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    return saved ? JSON.parse(saved) : initialAssignments;
  } catch (error) {
    console.error("Error loading assignments:", error);
    return initialAssignments;
  }
};

export function AppProvider({ children }) {
  const [assignments, setAssignments] = useState(
    getSavedAssignments
  );

  // Save assignments automatically
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(assignments)
      );
    } catch (error) {
      console.error("Error saving assignments:", error);
    }
  }, [assignments]);

  // Add new assignment
  const addAssignment = (assignment) => {
    const newAssignment = {
      ...assignment,
      id: Date.now(),
      submissions: Object.fromEntries(
        assignment.assignedTo.map((studentId) => [
          studentId,
          false,
        ])
      ),
    };

    setAssignments((prev) => [...prev, newAssignment]);
  };

  // Update existing assignment
  const updateAssignment = (id, updatedData) => {
    setAssignments((prev) =>
      prev.map((assignment) => {
        if (assignment.id !== id) return assignment;

        const newAssignedTo = updatedData.assignedTo;

        const newSubmissions = Object.fromEntries(
          newAssignedTo.map((studentId) => [
            studentId,
            assignment.submissions[studentId] ?? false,
          ])
        );

        return {
          ...assignment,
          ...updatedData,
          submissions: newSubmissions,
        };
      })
    );
  };

  // Delete assignment
  const deleteAssignment = (id) => {
    setAssignments((prev) =>
      prev.filter((assignment) => assignment.id !== id)
    );
  };

  // Submit assignment
  const submitAssignment = (assignmentId, studentId) => {
    setAssignments((prev) =>
      prev.map((assignment) => {
        if (assignment.id !== assignmentId) return assignment;

        return {
          ...assignment,
          submissions: {
            ...assignment.submissions,
            [studentId]: true,
          },
        };
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        assignments,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        submitAssignment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook
export function useAssignments() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useAssignments must be used inside AppProvider"
    );
  }

  return context;
}
