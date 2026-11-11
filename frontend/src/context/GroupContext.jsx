import { createContext, useContext, useEffect, useState } from "react";

const GroupContext = createContext(null);

const STORAGE_KEY = "joineazy_round2_groups";

export function GroupProvider({ children }) {
  const [groups, setGroups] = useState(() => {
    try {
      const savedGroups = localStorage.getItem(STORAGE_KEY);
      return savedGroups ? JSON.parse(savedGroups) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  }, [groups]);

  const getUserGroup = (courseId, userId) => {
    return (
      groups.find(
        (group) =>
          group.courseId === Number(courseId) &&
          group.members.some((member) => member.id === Number(userId)),
      ) || null
    );
  };

  const getCourseGroups = (courseId) => {
    return groups.filter((group) => group.courseId === Number(courseId));
  };

  const createGroup = (courseId, groupName, user) => {
    if (getUserGroup(courseId, user.id)) {
      return {
        success: false,
        message: "You are already in a group for this course.",
      };
    }

    const newGroup = {
      id: Date.now(),
      courseId: Number(courseId),
      name: groupName.trim(),
      leaderId: Number(user.id),
      leaderName: user.name,
      members: [
        {
          id: Number(user.id),
          name: user.name,
          email: user.email,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    setGroups((previous) => [...previous, newGroup]);

    return {
      success: true,
      group: newGroup,
    };
  };

  const joinGroup = (groupId, user) => {
    const existingGroup = getUserGroup(
      groups.find((group) => group.id === Number(groupId))?.courseId,
      user.id,
    );

    if (existingGroup) {
      return {
        success: false,
        message: "You are already in a group for this course.",
      };
    }

    const targetGroup = groups.find((group) => group.id === Number(groupId));

    if (!targetGroup) {
      return {
        success: false,
        message: "Group not found.",
      };
    }

    setGroups((previous) =>
      previous.map((group) =>
        group.id === Number(groupId)
          ? {
              ...group,
              members: [
                ...group.members,
                {
                  id: Number(user.id),
                  name: user.name,
                  email: user.email,
                },
              ],
            }
          : group,
      ),
    );

    return {
      success: true,
      message: "You joined the group successfully.",
    };
  };

  const value = {
    groups,
    createGroup,
    joinGroup,
    getUserGroup,
    getCourseGroups,
  };

  return (
    <GroupContext.Provider value={value}>{children}</GroupContext.Provider>
  );
}

export function useGroups() {
  const context = useContext(GroupContext);

  if (!context) {
    throw new Error("useGroups must be used inside GroupProvider");
  }

  return context;
}
