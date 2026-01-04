"use client";
interface TableProps {
  columns: string[];
  data: any[];
  renderRow: (item: any, index: number) => React.ReactNode;
}
export default function Table({ columns, data, renderRow }: TableProps) {
  return (
    <table className="min-w-full border border-gray-200 shadow-sm rounded">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col, i) => (
            <th key={i} className="p-2 border text-left">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            {renderRow(item, idx)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
