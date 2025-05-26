import { useEffect, useState } from "react";
import type { Apartment } from "@/types/apartments";
import { deleteApartmentById, getHostApartments } from "@/api/requests/apartments";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import SkeletonTable from "@/components/admin/TableSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Link } from "react-router-dom"; // Fixed import here
import { Eye, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddApartmentForm from "@/components/host/AddApartmentForm";

const HostApartments = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const entrepreneurId = useSelector(
    (state: RootState) => state.auth.user?.id
  );

  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
  };

  const handleFormSuccess = () => {
    setShowAddForm(false);
    // Refresh the apartment list after successful add
    fetchApartments();
  };

  const fetchApartments = async () => {
    if (!entrepreneurId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getHostApartments(entrepreneurId);
      setApartments(data);
    } catch (err: any) {
      setError(err.message || "Failed to load apartments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, [entrepreneurId]);

  const handleDelete = async (id: string) => {
    try {
      await deleteApartmentById(id);
      setApartments((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to delete apartment:", error);
    }
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Apartments Management</h2>

      <div className="flex justify-end mb-5">
        {!showAddForm && (
          <Button onClick={handleAddClick}>+ Add Apartment</Button>
        )}
      </div>

      {showAddForm ? (
        <AddApartmentForm
          onCancel={handleFormCancel}
          onSuccess={handleFormSuccess}
        />
      ) : (
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
                  <TableHead className="w-64">Description</TableHead>
                  <TableHead className="w-48 text-center">Features</TableHead>
                  <TableHead className="w-48 text-center">Rules</TableHead>
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
                    <TableCell className="text-center">
                      ${apartment.pricePerNight}
                    </TableCell>
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
                    <TableCell className="text-center">
                      {apartment.reviews?.length ?? 0}
                    </TableCell>
                    <TableCell className="text-center">
                      {apartment.avgRating.toFixed(1)}
                    </TableCell>
                    <TableCell>
                      {new Date(apartment.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link
                          replace
                          target="_blank"
                          to={`/apartments/${apartment.id}`}
                        >
                          <Eye size={18} />
                        </Link>

                        <button onClick={() => handleDelete(apartment.id)}>
                          <Trash size={18} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </>
  );
};

export default HostApartments;
