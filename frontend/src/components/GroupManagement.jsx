import { useState } from "react";
import { Users, Plus, UserPlus, Crown, CheckCircle2 } from "lucide-react";
import { useGroups } from "../context/GroupContext";

function GroupManagement({ courseId, user }) {
  const { groups, createGroup, joinGroup, getUserGroup, getCourseGroups } =
    useGroups();

  const [groupName, setGroupName] = useState("");
  const [message, setMessage] = useState("");

  const myGroup = getUserGroup(courseId, user.id);
  const courseGroups = getCourseGroups(courseId);

  const handleCreate = (e) => {
    e.preventDefault();

    if (!groupName.trim()) return;

    const result = createGroup(courseId, groupName, user);

    setMessage(result.success ? "Group created successfully!" : result.message);

    if (result.success) setGroupName("");
  };

  const handleJoin = (groupId) => {
    const result = joinGroup(groupId, user);
    setMessage(result.message);
  };

  return (
    <div className="mt-5 space-y-5">
      {message && (
        <p className="rounded-xl bg-indigo-50 p-3 text-sm text-indigo-700">
          {message}
        </p>
      )}

      {myGroup ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 size={20} />
            <h3 className="font-bold">Your Group: {myGroup.name}</h3>
          </div>

          <p className="mt-3 text-sm text-emerald-700">
            Leader: {myGroup.leaderName}
          </p>

          <h4 className="mt-4 flex items-center gap-2 font-semibold text-slate-700">
            <Users size={17} />
            Group Members ({myGroup.members.length})
          </h4>

          <div className="mt-3 space-y-2">
            {myGroup.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg bg-white p-3 text-sm"
              >
                <span>{member.name}</span>

                {member.id === myGroup.leaderId && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                    <Crown size={14} />
                    Leader
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <form
            onSubmit={handleCreate}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <h3 className="flex items-center gap-2 font-bold text-slate-800">
              <Plus size={19} />
              Create a New Group
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Create a group and become its leader.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                required
              />

              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Create Group
              </button>
            </div>
          </form>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="flex items-center gap-2 font-bold text-slate-800">
              <UserPlus size={19} />
              Join an Existing Group
            </h3>

            {courseGroups.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                No groups available. Create the first group!
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {courseGroups.map((group) => (
                  <div
                    key={group.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-4"
                  >
                    <div>
                      <h4 className="font-semibold text-slate-800">
                        {group.name}
                      </h4>

                      <p className="mt-1 text-xs text-slate-500">
                        Leader: {group.leaderName} · {group.members.length}{" "}
                        members
                      </p>
                    </div>

                    <button
                      onClick={() => handleJoin(group.id)}
                      className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                    >
                      Join Group
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default GroupManagement;
