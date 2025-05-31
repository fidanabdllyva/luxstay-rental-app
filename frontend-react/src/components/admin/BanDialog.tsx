import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";

interface BanDialogProps {
  onConfirm: (date: Date) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  user: { username: string };
}

const BanDialog = ({ onConfirm, open, setOpen, user }: BanDialogProps) => {
  const [banDate, setBanDate] = useState<Date | undefined>(undefined);

  const handleConfirm = () => {
    if (banDate) {
      onConfirm(banDate);
      setOpen(false); 
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban {user.username}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-2">Select the ban end date:</p>
          <Calendar
            mode="single"
            selected={banDate}
            onSelect={setBanDate}
            fromDate={new Date()}
          />
          {banDate && (
            <p className="text-sm text-muted-foreground mt-2">
              Selected: {format(banDate, "PPP")}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button
            disabled={!banDate}
            onClick={handleConfirm}
          >
            Confirm Ban
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BanDialog;
