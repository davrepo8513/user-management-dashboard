import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { FaEdit, FaTrash, FaGlobe, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import './UserTable.css';

const UserTable = ({ 
  users, 
  onEdit, 
  onDelete, 
  globalFilter, 
  setGlobalFilter,
  editingUserId 
}) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60,
        cell: ({ getValue }) => (
          <span className="user-id">#{getValue()}</span>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ getValue, row }) => (
          <div className="user-name-cell">
            <div className="user-avatar">
              {getValue().split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className="user-info">
              <strong>{getValue()}</strong>
              <small>@{row.original.username}</small>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ getValue }) => (
          <a href={`mailto:${getValue()}`} className="email-link">
            {getValue()}
          </a>
        ),
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ getValue }) => getValue() || '-',
      },
      {
        accessorKey: 'address.city',
        header: 'City',
        cell: ({ row }) => row.original.address?.city || '-',
      },
      {
        accessorKey: 'company.name',
        header: 'Company',
        cell: ({ row }) => row.original.company?.name || '-',
      },
      {
        accessorKey: 'website',
        header: 'Website',
        cell: ({ getValue }) => 
          getValue() ? (
            <a 
              href={getValue().startsWith('http') ? getValue() : `https://${getValue()}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="website-link"
            >
              <FaGlobe />
            </a>
          ) : '-',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="action-buttons">
            <button
              onClick={() => onEdit(row.original)}
              className="btn btn-edit"
              disabled={editingUserId && editingUserId !== row.original.id}
              title="Edit user"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => onDelete(row.original)}
              className="btn btn-delete"
              disabled={editingUserId}
              title="Delete user"
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete, editingUserId]
  );

  const table = useReactTable({
    data: users,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="table-info">
          <h3>Users ({table.getFilteredRowModel().rows.length})</h3>
        </div>
        <div className="table-search">
          <input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="🔍 Search users..."
            className="search-input"
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className={header.column.getCanSort() ? 'sortable' : ''}
                  >
                    <div
                      className="header-content"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="sort-icon">
                          {header.column.getIsSorted() === 'asc' ? (
                            <FaSortUp />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <FaSortDown />
                          ) : (
                            <FaSort />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr 
                key={row.id}
                className={editingUserId === row.original.id ? 'editing' : ''}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-pagination">
        <div className="pagination-info">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
          <span>
            ({table.getFilteredRowModel().rows.length} total users)
          </span>
        </div>
        
        <div className="pagination-controls">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="btn btn-pagination"
          >
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="btn btn-pagination"
          >
            {'<'}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="btn btn-pagination"
          >
            {'>'}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="btn btn-pagination"
          >
            {'>>'}
          </button>
        </div>

        <div className="page-size-selector">
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="page-size-select"
          >
            {[5, 10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default UserTable;