import {
  getUsers,
  deleteUser,
  updateUser,
} from "@/api/requests/users";
import SkeletonTable from "@/components/admin/TableSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import type { User } from "@/types/users";
import { Eye, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<User>) => {
    try {
      const updated = await updateUser(id, updates);
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, ...updated } : user))
      );
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  const renderHostStatus = (user: User) => {
    if (user.hostRequest) {
      return user.apartments?.length ? "Yes" : "Requested";
    }
    return "No";
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Users Management</h2>

      <div className="overflow-x-auto">
        {loading ? (
          <SkeletonTable
            rowsCount={10}
            columns={[
              { label: "Username", width: "w-40" },
              { label: "Email", width: "w-50" },
              { label: "Role", width: "w-32" },
              { label: "Profile Image", width: "w-40" },
              { label: "Balance", width: "w-50" },
              { label: "Host Status", width: "w-48" },
              { label: "Apartments", width: "w-48" },
              { label: "Bookings", width: "w-48" },
              { label: "Is Banned", width: "w-48" },
              { label: "Ban Date", width: "w-40" },
              { label: "Reviews", width: "w-24" },
              { label: "Last Login", width: "w-28" },
              { label: "Created At", width: "w-32" },
              { label: "Actions", width: "w-28" },
            ]}
          />
        ) : (
          <Table className="min-w-[1100px] table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">Username</TableHead>
                <TableHead className="w-50">Email</TableHead>
                <TableHead className="w-32">Role</TableHead>
                <TableHead className="w-40">Profile Image</TableHead>
                <TableHead className="w-50">Balance</TableHead>
                <TableHead className="w-48">Host Status</TableHead>
                <TableHead className="w-48">Apartments</TableHead>
                <TableHead className="w-48">Bookings</TableHead>
                <TableHead className="w-48">Is Banned</TableHead>
                <TableHead className="w-40">Ban Date</TableHead>
                <TableHead className="w-24">Reviews</TableHead>
                <TableHead className="w-28">Last Login</TableHead>
                <TableHead className="w-32">Created At</TableHead>
                <TableHead className="w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium truncate max-w-[160px]">
                    {user.username}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <img
                      src={user.profileImage}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    ${user.balance}
                      
  
                  </TableCell>
                  <TableCell>{renderHostStatus(user)}</TableCell>
                  <TableCell>{user.apartments?.length || "Not a host"}</TableCell>
                  <TableCell>{user.bookings?.length || 0}</TableCell>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={user.isBanned}
                      onChange={(e) =>
                        handleUpdate(user.id, { isBanned: e.target.checked })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {user.banDate
                      ? new Date(user.banDate).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>{user.reviews?.length || 0}</TableCell>
                  <TableCell>
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link
                        replace
                        target="_blank"
                        to={`/users/${user.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        <Eye size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
};

export default UsersManagement;
