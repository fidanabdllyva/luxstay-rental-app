import { useEffect, useState } from 'react'
import { getSlider, deleteSlider } from '@/api/requests/slider'
import SkeletonTable from '@/components/admin/TableSkeleton'
import { SquarePen, Trash } from "lucide-react"


import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/src/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle,
} from '@/src/components/ui/dialog'
import type { Slide } from '@/types/slider'
import AddSliderForm from '@/components/admin/AddSliderForm'
import EditSliderForm from '@/components/admin/EditSliderForm'

const SlidersManagement = () => {
  const [sliders, setSliders] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [editSlider, setEditSlider] = useState<Slide | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const fetchData = async () => {
    try {
      const slidersData = await getSlider()
      setSliders(slidersData)
    } catch (error) {
      console.error('Failed to fetch sliders', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this slider?")
    if (!confirm) return

    try {
      await deleteSlider(id)
      // toast.success("Slider deleted successfully")
      fetchData()
    } catch (err) {
      // toast.error("Failed to delete slider")
    }
  }


  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Sliders Management</h2>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>+ Add Slider</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Slider</DialogTitle>
            </DialogHeader>
            <AddSliderForm onSuccess={() => {
              fetchData()
              setAddDialogOpen(false)
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <SkeletonTable
            rowsCount={10}
            columns={[
              { label: 'Title', width: 'w-40' },
              { label: 'Image', width: 'w-24' },
              { label: 'Page', width: 'w-32' },
              { label: 'Actions', width: 'w-28' },
            ]}
          />
        ) : (
          <Table className="min-w-[1000px] table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">Title</TableHead>
                <TableHead className="w-30 text-center">Image</TableHead>
                <TableHead className="w-20 text-center">Page</TableHead>
                <TableHead className="w-28 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sliders.map((slider) => (
                <TableRow key={slider.id}>
                  <TableCell>{slider.title}</TableCell>
                  <TableCell>
                    <img
                      src={slider.imageURL}
                      alt={slider.title}
                      className="mx-auto w-[200px] h-[100px] object-cover"
                    />
                  </TableCell>
                  <TableCell className="text-center">{slider.page}</TableCell>
                  <TableCell className="text-center flex justify-center gap-2 mt-8">
                    <Dialog open={editDialogOpen && editSlider?.id === slider.id} onOpenChange={setEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="icon" variant="outline" onClick={() => {
                          setEditSlider(slider)
                          setEditDialogOpen(true)
                        }}>
                        
                         <SquarePen />
                  
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Slider</DialogTitle>
                        </DialogHeader>
                        <EditSliderForm
                          slider={slider}
                          onSuccess={() => {
                            fetchData()
                            setEditDialogOpen(false)
                          }}
                        />
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(slider.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
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

export default SlidersManagement
