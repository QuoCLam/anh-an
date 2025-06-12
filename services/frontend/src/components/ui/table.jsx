import React from "react";

/**
 * Table component tái sử dụng.
 * - columns: [{ header, accessor }]
 *   + accessor: string (tên trường trong row) hoặc function (nhận row, trả về JSX hoặc value)
 * - data: array các object
 * - children: nếu có, sẽ render dưới tbody (thích hợp cho dòng loading/empty)
 */
export default function Table({ columns = [], data = [], children, ...rest }) {
  return (
    <table className="min-w-full border border-gray-300" {...rest}>
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th
              key={idx}
              className="px-4 py-2 border-b bg-gray-100 text-left"
            >
              {col.header || col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data && data.length > 0 ? (
          data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-4 py-2 border-b">
                  {typeof col.accessor === "function"
                    ? col.accessor(row)
                    : row[col.accessor || col]}
                </td>
              ))}
            </tr>
          ))
        ) : (
          // Nếu không có data, render children (thường là dòng thông báo hoặc loading)
          children
        )}
      </tbody>
    </table>
  );
}
