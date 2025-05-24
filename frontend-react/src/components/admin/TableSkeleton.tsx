import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

type SkeletonTableProps = {
  columns: { label: string; width?: string }[];
  rowsCount?: number;
};

const SkeletonTable = ({ columns, rowsCount = 8 }: SkeletonTableProps) => {
  const rows = Array.from({ length: rowsCount });

  return (
    <Table className="min-w-full table-fixed animate-pulse">
      <TableHeader>
        <TableRow>
          {columns.map((col, i) => (
            <TableHead key={i} className={col.width}>
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((_, rowIdx) => (
          <TableRow key={rowIdx}>
            {columns.map((_, colIdx) => (
              <TableCell key={colIdx}>
                <div className="h-4 rounded bg-muted w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SkeletonTable;
