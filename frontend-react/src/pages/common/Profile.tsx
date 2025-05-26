import ProfileBookingsWishlist from "@/components/client/ProfileBookingsWishlist"
import ProfileClientCard from "@/components/client/ProfileClientCard"

const ClientProfile = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 px-4 py-6">
      <div className="bg-white border rounded-2xl p-2 self-start">
        <ProfileClientCard />
      </div>

      <div className="bg-white  p-4">
        <ProfileBookingsWishlist />
      </div>
    </div>
  )
}

export default ClientProfile
