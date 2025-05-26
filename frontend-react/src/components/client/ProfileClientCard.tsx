import { Button } from "@/components/ui/button";

const ProfileClientCard = () => {
  return (
    <div className="flex flex-col items-center text-center p-2 space-y-8">
      {/* Avatar Placeholder */}
      <div className="w-24 h-24 rounded-full bg-gray-200" />

      {/* Name and Role */}
      <div>
        <h2 className="text-xl font-semibold">John Doe</h2>
        <p className="text-gray-500">Client</p>
      </div>

      {/* User Info */}
      <div className="space-y-1 text-sm w-full text-left">
        <p>
          <span className="font-medium">Username: </span>
          johndoe
        </p>
        <p>
          <span className="font-medium">Email: </span>
          john.doe@example.com
        </p>
        <p>
          <span className="font-medium">Member Since: </span>
          January 15, 2023
        </p>
        <p>
          <span className="font-medium">Balance: </span>
          $500.00
        </p>
      </div>

      {/* Action Buttons */}
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
        <Button variant="default" className="w-full">
          Become a Host
        </Button>
      </div>
    </div>
  );
};

export default ProfileClientCard;
