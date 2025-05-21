import React, { useState } from 'react';
import { DateRange, type RangeKeyDict, type Range } from 'react-date-range';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

type Props = {
  onChange: (startDate: Date, endDate: Date) => void;
};

const DateRangeCalendar: React.FC<Props> = ({ onChange }) => {
  const [range, setRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection',
    },
  ]);

  const handleChange = (ranges: RangeKeyDict) => {
    const selection = ranges.selection;
    setRange([selection]);

    const start = selection.startDate ?? new Date();
    const end = selection.endDate ?? addDays(new Date(), 1);

    onChange(start, end);
  };

  return (
    <div className="rounded-lg shadow-md overflow-hidden">
      <DateRange
        editableDateInputs={true}
        onChange={handleChange}
        moveRangeOnFirstSelection={false}
        ranges={range}
        minDate={new Date()}
        rangeColors={['#000']}
      />
    </div>
  );
};

export default DateRangeCalendar;
