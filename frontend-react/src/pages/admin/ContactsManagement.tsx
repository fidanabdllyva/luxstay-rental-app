import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { Button } from "@/components/ui/button"
import { Check, Mail, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import type { Contact } from "@/types/contact"
import { deleteContact, getContacts, updateContact } from "@/api/requests/contacts"
import SkeletonTable from "@/components/admin/TableSkeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog"

const AdminApartments = () => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  const readMessage = async (id: string) => {
    try {
      await updateContact(id, { isRead: true })
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isRead: true } : c))
      )
    } catch (err) {
      console.error("Failed to update contact:", err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteContact(id)
      setContacts((prev) => prev.filter((c) => c.id !== id))
    } catch (error) {
      console.error("Failed to delete contact:", error)
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getContacts()
        setContacts(data)
      } catch (error) {
        console.error("Error fetching contacts:", error)
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
              { label: "Full Name", width: "w-40" },
              { label: "Email", width: "w-40" },
              { label: "Subject", width: "w-32" },
              { label: "Message", width: "w-64" },
              { label: "Submitted At", width: "w-40" },
              { label: "Actions", width: "w-28" },
            ]}
          />
        ) : (
          <Table className="min-w-[900px] table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">Full Name</TableHead>
                <TableHead className="w-40">Email</TableHead>
                <TableHead className="w-32">Subject</TableHead>
                <TableHead className="w-40">Message</TableHead>
                <TableHead className="w-20 text-center">Is Read</TableHead>
                <TableHead className="w-30">Submitted At</TableHead>
                <TableHead className="w-28 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="truncate max-w-[160px]">{contact.fullName}</TableCell>
                    <TableCell className="truncate max-w-[160px]">{contact.email}</TableCell>
                    <TableCell className="truncate max-w-[160px]" title={contact.subject}>
                      {contact.subject}
                    </TableCell>
                    <TableCell className="truncate max-w-[300px]" title={contact.message}>
                      {contact.message}
                    </TableCell>
                    <TableCell className="text-center">
                      {contact.isRead ? (
                        <span className="inline-block px-3 py-1 text-sm font-semibold text-green-800 bg-green-200 rounded-full">
                          Read
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 text-sm font-semibold text-red-800 bg-red-200 rounded-full">
                          Unread
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(contact.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center gap-2">
                        <Button onClick={() => handleDelete(contact.id)} className="cursor-pointer" variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4" />
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Mail className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Message from {contact.fullName}</DialogTitle>
                              <DialogDescription>
                                Received on {new Date(contact.submittedAt).toLocaleDateString()}
                              </DialogDescription>
                              <div className="mt-4">
                                <DialogTitle>Email</DialogTitle>
                                <DialogDescription>{contact.email}</DialogDescription>
                              </div>
                              <div className="mt-4">
                                <DialogTitle>Message</DialogTitle>
                                <DialogDescription className="break-words max-w-md">{contact.message}</DialogDescription>
                              </div>
                            </DialogHeader>
                            {contact.isRead ? <></>
                            :
                            <div className=" bottom-4 right-4 left-4">
                              <Button onClick={() => readMessage(contact.id)} className="max-w-2xl">
                                <Check className="w-4 h-4 mr-2" />
                                Mark as Read
                              </Button>
                            </div>}

                          </DialogContent>
                        </Dialog>


                        <Button
                          onClick={() => readMessage(contact.id)}
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer "
                        >
                          <Check className="w-4 h-4" />
                        </Button>

                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No apartments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  )
}

export default AdminApartments
