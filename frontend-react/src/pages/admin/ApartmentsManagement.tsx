import { getApartments } from "@/api/requests/apartments"
import SkeletonTable from "@/components/admin/TableSkeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import type { Apartment } from "@/types/apartments"
import { Eye, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router"

const ApartmentsManagement = () => {
  const [apartments, setApartments] = useState<Apartment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apartmentsData = await getApartments()
        setApartments(apartmentsData)
      } catch (error) {
        console.error("Failed to fetch apartments", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Apartments Management</h2>

      <div className="overflow-x-auto">
        {loading ? (

          <SkeletonTable
            rowsCount={10}
            columns={[
              { label: "Title", width: "w-40" },
              { label: "Type", width: "w-24" },
              { label: "Location", width: "w-32" },
              { label: "Price/Night", width: "w-32" },
              { label: "Description", width: "w-64" },
              { label: "Features", width: "w-48" },
              { label: "Rules", width: "w-48" },
              { label: "Entrepreneur", width: "w-40" },
              { label: "Reviews", width: "w-24" },
              { label: "Avg Rating", width: "w-28" },
              { label: "Created At", width: "w-32" },
              { label: "Actions", width: "w-28" },
            ]}
          />
        ) : (
          <Table className="min-w-[1200px] table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">Title</TableHead>
                <TableHead className="w-24 text-center">Type</TableHead>
                <TableHead className="w-32 text-center">Location</TableHead>
                <TableHead className="w-32 text-center">Price/Night</TableHead>
                <TableHead className="w-64 ">Description</TableHead>
                <TableHead className="w-48 text-center">Features</TableHead>
                <TableHead className="w-48 text-center">Rules</TableHead>
                <TableHead className="w-40 text-center">Entrepreneur</TableHead>
                <TableHead className="w-24 text-center">Reviews</TableHead>
                <TableHead className="w-28 text-center">Avg Rating</TableHead>
                <TableHead className="w-32">Created At</TableHead>
                <TableHead className="w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {apartments.map((apartment) => (
                <TableRow key={apartment.id}>
                  <TableCell className="font-medium truncate max-w-[160px] whitespace-nowrap overflow-hidden">
                    {apartment.title}
                  </TableCell>
                  <TableCell className="text-center">{apartment.type}</TableCell>
                  <TableCell className="text-center">{apartment.location}</TableCell>
                  <TableCell className="text-center">${apartment.pricePerNight}</TableCell>
                  <TableCell className="truncate">{apartment.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {apartment.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-xs bg-muted text-muted-foreground border rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {apartment.rules.map((rule, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-xs bg-muted text-muted-foreground border rounded-full"
                        >
                          {rule}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{apartment.entrepreneur?.username}</TableCell>
                  <TableCell className="text-center">{apartment.reviews?.length ?? 0}</TableCell>
                  <TableCell className="text-center">{apartment.avgRating.toFixed(1)}</TableCell>
                  <TableCell>{new Date(apartment.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">

                    <Link replace target="blank" to={`/apartments/${apartment.id}`}>
                      <Eye size={18}/>
                      </Link>

                      <Trash  size={18}/>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  )
}

export default ApartmentsManagement
