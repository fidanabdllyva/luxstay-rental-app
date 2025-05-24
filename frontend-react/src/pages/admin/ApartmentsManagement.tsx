import { getApartments } from "@/api/requests/apartments"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import type { Apartment } from "@/types/apartments"
import { useEffect, useState } from "react"

const ApartmentsManagement = () => {
  const [apartments, setApartments] = useState<Apartment[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apartmentsData = await getApartments()
        setApartments(apartmentsData)
      } catch (error) {
        console.error("Failed to fetch apartments", error)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Apartments Management</h2>

      <div className="overflow-x-auto">
        <Table className="min-w-[1200px] table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Title</TableHead>
              <TableHead className="w-24">Type</TableHead>
              <TableHead className="w-32">Location</TableHead>
              <TableHead className="w-32">Price/Night</TableHead>
              <TableHead className="w-64">Description</TableHead>
              <TableHead className="w-48">Features</TableHead>
              <TableHead className="w-48">Rules</TableHead>
              <TableHead className="w-40">Entrepreneur</TableHead>
              <TableHead className="w-24">Reviews</TableHead>
              <TableHead className="w-28">Avg Rating</TableHead>
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

                <TableCell>{apartment.type}</TableCell>
                <TableCell>{apartment.location}</TableCell>
                <TableCell>${apartment.pricePerNight}</TableCell>
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

                <TableCell>{apartment.entrepreneur?.username}</TableCell>
                <TableCell>{apartment.reviews?.length ?? 0}</TableCell>
                <TableCell>{apartment.avgRating.toFixed(1)}</TableCell>
                <TableCell>{new Date(apartment.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <button className="text-blue-600 hover:underline">Edit</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default ApartmentsManagement
