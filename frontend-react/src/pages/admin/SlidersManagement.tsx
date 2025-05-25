import { getSliders } from "@/api/requests/slider"
import SkeletonTable from "@/components/admin/TableSkeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import type { Slide } from "@/types/slider"
import { useEffect, useState } from "react"

const SlidersManagement = () => {
  const [sliders, setSliders] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const slidersData = await getSliders()
        setSliders(slidersData)
        console.log(slidersData)
      } catch (error) {
        console.error("Failed to fetch sliders", error)
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
              { label: "Image", width: "w-24" },
              { label: "Page", width: "w-32" },
            ]}
          />
        ) : (
          <Table className="min-w-[1000px] table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">Title</TableHead>
                <TableHead className="w-30 text-center">Image</TableHead>
                <TableHead className="w-20 text-center">Page</TableHead>
                <TableHead className="w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sliders.map((slider) => (
                <TableRow key={slider.id}>
                <TableCell>{slider.title}</TableCell>
                <TableCell>{
                  <img src={slider.imageURL} alt={slider.title} className="mx-auto w-[200px] h-[100px] object-cover" /> }</TableCell>
                  <TableCell className="text-center">{slider.page}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  )
}

export default SlidersManagement
