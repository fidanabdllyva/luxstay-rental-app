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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog"

const AdminApartments = () => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

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
      setDeletingId(id)
      await deleteContact(id)
      setContacts((prev) => prev.filter((c) => c.id !== id))
    } catch (error) {
      console.error("Failed to delete contact:", error)
    } finally {
      setDeletingId(null)
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
                        <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-black rounded-full">
                          Read
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 text-sm font-semibold  border rounded-full">
                          Unread
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(contact.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center gap-2">
                        {/* AlertDialog for Delete Confirmation */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="cursor-pointer"
                              disabled={deletingId === contact.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the message from <strong>{contact.fullName}</strong>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDelete(contact.id)}
                                disabled={deletingId === contact.id}
                              >
                                {deletingId === contact.id ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        {/* View Message Dialog */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="cursor-pointer">
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
                            {!contact.isRead && (
                              <div className="bottom-4 right-4 left-4">
                                <Button onClick={() => readMessage(contact.id)} className="max-w-2xl">
                                  <Check className="w-4 h-4 mr-2" />
                                  Mark as Read
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {/* Quick Mark as Read Button */}
                        <Button
                          onClick={() => readMessage(contact.id)}
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          disabled={contact.isRead}
                          title={contact.isRead ? "Already read" : "Mark as read"}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
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
