import { updateUser } from "@/api/requests/users";
import { Button } from "@/components/ui/button";
import { setUser } from "@/redux/features/auth/authSlice";
import type { RootState } from "@/redux/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog"
import EditProfileDialog from "./EditProfileDialog";

const ProfileClientCard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [hostRequestLoading, setHostRequestLoading] = useState(false);

  const handleBecomeHost = async () => {
    if (!user || user.hostRequest) return;

    setHostRequestLoading(true);
    try {
      const updatedUser = await updateUser(user.id, { hostRequest: true });
      dispatch(setUser(updatedUser));
    } catch (error) {
      console.error(error);
      alert("Failed to send host request. Please try again.");
    } finally {
      setHostRequestLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col items-center text-center p-2 space-y-8">
      <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.username}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-500">
            No Image
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold">{user.username}</h2>
        <p className="text-gray-500 capitalize">{user.role}</p>
      </div>

      <div className="space-y-2 text-sm w-full text-left">
        <div>
          <span className="font-medium">Username </span>
          <p className="text-muted-foreground">{user.username}</p>
        </div>
        <div>
          <span className="font-medium">Email </span>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <div>
          <span className="font-medium">Member Since </span>
          <p className="text-muted-foreground">
            {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <span className="font-medium">Balance </span>
          <p className="font-bold">${user.balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="w-full space-y-2">
        {/* edit dialog */}
        <EditProfileDialog />

        {/* change password dialog */}

        <Dialog >
          <DialogTrigger className="w-full border rounded py-1.5 font-semibold text-sm">Change Password</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Change Password
                <p className="text-muted-foreground text-sm font-light mt-1">Enter your current password and a new password</p>
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {/* add balance dialog */}
        <Dialog >
          <DialogTrigger className="w-full border rounded py-1.5 font-semibold text-sm">Add Balance</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Add Balance
                <p className="text-muted-foreground text-sm font-light mt-1">Add funds to your account balance</p>
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

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
