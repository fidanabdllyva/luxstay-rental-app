import { getUser } from "@/api/requests/users"
import SkeletonDetailPage from "@/components/client/SkeletonDetailPage"
import ProfileBookingsWishlist from "@/components/common/ProfileBookingsWishlist"
import ProfileClientCard from "@/components/common/ProfileClientCard"
import type { RootState } from "@/redux/store"
import type { User } from "@/types/users"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const ClientProfile = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true);

  const userID = useSelector((state: RootState) => state.auth.user?.id)
  useEffect(() => {
    const fetchApartments = async () => {
      try {
        if (userID) {
          const data = await getUser(userID);
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApartments();
  }, []);

  if (loading) return <> <SkeletonDetailPage/></>

  if (!user) return <p className="text-red-600">User not found</p>
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 px-4 py-6">
      <div className="bg-white border rounded-2xl p-2 self-start">


        <ProfileClientCard  />

      </div>

      <div className="bg-white  p-4">
        <ProfileBookingsWishlist user={user} />
      </div>
    </div>
  )
}

export default ClientProfile
