import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUsers, toggleUserStatus } from "../../services/adminService";

import styles from "./users.module.css";
import type { User as UserTypes, UserInfo } from "../../types";
import { Role, Status } from "../../enums";
import User from "../../components/user/user";

type UsersPropsType = {
  user: UserInfo | null;
};

const Users = ({ user }: UsersPropsType) => {
  const [users, setUsers] = useState<Array<UserTypes>>([]);
  const [loading, setLoading] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id || user.role !== Role.ADMIN) return;

    setLoading(true);
    getUsers()
      .then((res) => {
        const { users } = res.data;
        setUsers(users);
      })
      .catch((error) => {
        toast.error("Failed to load users");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.id, user?.role]);

  const handleToggleUserStatus = async (userId: string, currentStatus: Status) => {
    setUpdatingUserId(userId);

    try {
      await toggleUserStatus(userId);

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, status: currentStatus === Status.ACTIVE ? Status.BLOCKED : Status.ACTIVE } : u
        )
      );

      const newStatus = currentStatus === Status.ACTIVE ? "blocked" : "unblocked";
      toast.success(`User ${newStatus} successfully`);
    } catch (error) {
      toast.error("Failed to update user status");
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className={styles.users}>
      <h2>User Management</h2>
      <div className={styles["users-container"]}>
        {loading && <p>Loading users...</p>}
        {!loading && users.length === 0 && <p>No users found.</p>}
        {!loading && users.length > 0 && (
          <div className={styles["users-grid"]}>
            {users.map((user) => (
              <User
                key={user.id}
                user={user}
                isUpdating={updatingUserId === user.id}
                onStatusToggle={() => handleToggleUserStatus(user.id, user.status)}
              ></User>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
