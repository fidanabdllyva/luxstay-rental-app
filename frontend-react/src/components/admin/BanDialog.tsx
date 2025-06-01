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
  const [time, setTime] = useState("12:00"); 
  const handleConfirm = () => {
    if (banDate && time) {
      const [hours, minutes] = time.split(":").map(Number);
      const fullDate = new Date(banDate);
      fullDate.setHours(hours);
      fullDate.setMinutes(minutes);
      fullDate.setSeconds(0);
      fullDate.setMilliseconds(0);

      onConfirm(fullDate);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban {user.username}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <p className="mb-2">Select ban end date:</p>
            <Calendar
              mode="single"
              selected={banDate}
              onSelect={setBanDate}
              fromDate={new Date()}
            />
          </div>

          <div>
            <label htmlFor="ban-time" className="block text-sm mb-1">
              Select ban end time:
            </label>
            <input
              id="ban-time"
              type="time"
              className="border rounded px-3 py-1 w-full"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          {banDate && (
            <p className="text-sm text-muted-foreground">
              Selected: {format(banDate, "PPP")} at {time}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button disabled={!banDate || !time} onClick={handleConfirm}>
            Confirm Ban
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BanDialog;
