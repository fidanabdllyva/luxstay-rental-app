import { updateUser } from "@/api/requests/users";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/users";
import { useState } from "react";

type Props = {
  user: User;
  setUser: (user: User) => void; 
};

const ProfileClientCard = ({ user, setUser }: Props) => {
  const [hostRequestLoading, setHostRequestLoading] = useState(false);

  const handleBecomeHost = async () => {
    if (!user || user.hostRequest) return;

    setHostRequestLoading(true);
    try {
      const updatedUser = await updateUser(user.id, { hostRequest: true });
      setUser(updatedUser);
    } catch (error) {
      alert("Failed to send host request. Please try again.");
      console.error(error);
    } finally {
      setHostRequestLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center p-2 space-y-8">
      <div className="w-24 h-24 rounded-full bg-gray-200">
        <img
          src={user.profileImage}
          alt={user.username}
          className="w-24 h-24 rounded-full"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold">{user.username}</h2>
        <p className="text-gray-500 capitalize">{user.role}</p>
      </div>

      <div className="space-y-1 text-sm w-full text-left">
        <p>
          <span className="font-medium">Username: </span>
          {user.username}
        </p>
        <p>
          <span className="font-medium">Email: </span>
          {user.email}
        </p>
        <p>
          <span className="font-medium">Member Since: </span>
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
        <p>
          <span className="font-medium">Balance: </span>
          ${user.balance.toFixed(2)}
        </p>
      </div>

      <div className="w-full space-y-2">
        <Button variant="outline" className="w-full">
          Edit Profile
        </Button>
        <Button variant="outline" className="w-full">
          Change Password
        </Button>
        <Button variant="outline" className="w-full">
          Add Balance
        </Button>

        {user.role === "CLIENT" && !user.hostRequest && (
          <Button
            className="w-full bg-black text-white hover:bg-black/80"
            onClick={handleBecomeHost}
            disabled={hostRequestLoading}
          >
            {hostRequestLoading ? "Requesting..." : "Become a Host"}
          </Button>
        )}

        {user.hostRequest && (
          <p className="text-sm text-muted-foreground text-center">
            Host request already sent.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileClientCard;
