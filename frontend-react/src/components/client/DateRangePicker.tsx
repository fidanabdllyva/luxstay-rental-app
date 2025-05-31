import React, { useState } from 'react';
import { DateRange, type RangeKeyDict, type Range } from 'react-date-range';
import { addDays, differenceInCalendarDays, isSameDay } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import type { Apartment } from '@/types/apartments';

type Props = {
  onChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
  apartment: Apartment;
  disabledDates?: Date[];
};

const DateRangeCalendar: React.FC<Props> = ({ onChange, apartment, disabledDates = [] }) => {
  const [range, setRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const startDate = range[0].startDate ?? new Date();
  const endDate = range[0].endDate ?? addDays(new Date(), 1);
  const nights = differenceInCalendarDays(endDate, startDate);

  const pricePerNight = apartment?.pricePerNight ?? 0;
  const cleaningFee = 50;
  const serviceFee = pricePerNight * 0.1;
  const totalPrice = nights > 0 ? nights * pricePerNight + cleaningFee + serviceFee : 0;

  const handleChange = (ranges: RangeKeyDict) => {
    const selection = ranges.selection;
    setRange([selection]);

    const start = selection.startDate ?? new Date();
    const end = selection.endDate ?? addDays(new Date(), 1);

    onChange(start, end);
  };

  return (
    <>
      <div className="rounded-lg shadow-md overflow-hidden">
        <DateRange
          editableDateInputs={true}
          onChange={handleChange}
          moveRangeOnFirstSelection={false}
          ranges={range}
          minDate={new Date()}
          rangeColors={['#000']}
          disabledDates={disabledDates}
          dayContentRenderer={(date) => {
            const isBooked = disabledDates.some(disabledDate => isSameDay(disabledDate, date));
            return (
              <div className={isBooked ? 'bg-red-300 text-white rounded-full w-6 h-6 flex items-center justify-center' : undefined}>
                {date.getDate()}
              </div>
            );
          }}
        />

      </div>

      <div className="mt-6 text-sm text-gray-700 space-y-1">
        <div className="flex justify-between">
          <span>
            ${pricePerNight} × {nights} night{nights > 1 ? 's' : ''}
          </span>
          <span>${nights * pricePerNight}</span>
        </div>
        <div className="flex justify-between">
          <span>Cleaning fee</span>
          <span>${cleaningFee}</span>
        </div>
        <div className="flex justify-between">
          <span>Service fee</span>
          <span>${serviceFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold border-t pt-2 mt-2">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <p className="mt-4 text-red-600 font-medium">
        * Red dates are already booked and cannot be selected.
      </p>
    </>
  );
};

export default DateRangeCalendar;
