import React, { useState, useMemo } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { AiOutlineSearch } from "react-icons/ai";
import { FiFilter, FiEdit2, FiTrash2, FiUsers } from "react-icons/fi";
import { BiDuplicate } from "react-icons/bi";

export default function FeesDashboard({
  fees,
  classrooms,
  onCreateFee,
  onEditFee,
  onDeleteFee,
  onAssignStudents,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [viewMode, setViewMode] = useState("table");

  const filteredAndSortedFees = useMemo(() => {
    let filtered = fees.filter((fee) => {
      const query = searchQuery.toLowerCase();
      return (
        fee.className.toLowerCase().includes(query) ||
        fee.fee_type.toLowerCase().includes(query) ||
        fee.amount.toString().includes(query)
      );
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "amount_asc":
          return a.amount - b.amount;
        case "amount_desc":
          return b.amount - a.amount;
        case "class":
          return a.className.localeCompare(b.className);
        case "type":
          return a.fee_type.localeCompare(b.fee_type);
        case "created_at":
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

    return filtered;
  }, [fees, searchQuery, sortBy]);

  const getCollectionColor = (percentage) => {
    if (percentage === 0) return "text-red-600 bg-red-50";
    if (percentage < 50) return "text-orange-600 bg-orange-50";
    if (percentage < 100) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  const groupedByClass = useMemo(() => {
    const grouped = {};
    filteredAndSortedFees.forEach((fee) => {
      if (!grouped[fee.className]) {
        grouped[fee.className] = [];
      }
      grouped[fee.className].push(fee);
    });
    return grouped;
  }, [filteredAndSortedFees]);

  return (
    <div className="px-4 md:px-10 py-6">
      {/* Header */}
      <div className="flex flex-col justify-between items-start md:items-center md:flex-row mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
          <p className="text-gray-500 mt-1">
            Manage fees, concessions, and payment tracking
          </p>
        </div>
        <button
          onClick={onCreateFee}
          className="flex items-center justify-center px-6 py-3 mt-4 md:mt-0 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-md"
        >
          <IoMdAddCircleOutline className="mr-2" size={20} />
          Create Fee
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 w-full md:w-auto">
          <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by class, fee type, or amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <FiFilter className="text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 md:flex-none px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          >
            <option value="created_at">Latest First</option>
            <option value="class">By Class</option>
            <option value="type">By Fee Type</option>
            <option value="amount_asc">Amount: Low to High</option>
            <option value="amount_desc">Amount: High to Low</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("table")}
            className={`px-4 py-2 rounded font-semibold transition ${
              viewMode === "table"
                ? "bg-white text-indigo-600 shadow"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setViewMode("grouped")}
            className={`px-4 py-2 rounded font-semibold transition ${
              viewMode === "grouped"
                ? "bg-white text-indigo-600 shadow"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            By Class
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-600 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-semibold">Total Fees</p>
          <p className="text-2xl font-bold text-blue-700">{fees.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-600 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-semibold">Total Amount</p>
          <p className="text-2xl font-bold text-green-700">
            ₹{fees.reduce((sum, f) => sum + parseFloat(f.amount || 0), 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-600 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-semibold">Classes</p>
          <p className="text-2xl font-bold text-purple-700">
            {new Set(fees.map((f) => f.classroom_id)).size}
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-600 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-semibold">Avg Collection</p>
          <p className="text-2xl font-bold text-orange-700">
            {fees.length > 0
              ? (
                  fees.reduce((sum, f) => sum + (f.collection_status?.collection_percentage || 0), 0) / fees.length
                ).toFixed(1)
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Content */}
      {filteredAndSortedFees.length === 0 ? (
        <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <p className="text-gray-500 text-lg font-semibold">No fees found</p>
            <p className="text-gray-400 mt-2">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Create a new fee to get started"}
            </p>
          </div>
        </div>
      ) : viewMode === "table" ? (
        <TableView
          fees={filteredAndSortedFees}
          onEdit={onEditFee}
          onDelete={onDeleteFee}
          onAssignStudents={onAssignStudents}
        />
      ) : (
        <GroupedView
          groupedFees={groupedByClass}
          onEdit={onEditFee}
          onDelete={onDeleteFee}
          onAssignStudents={onAssignStudents}
        />
      )}
    </div>
  );
}

function TableView({ fees, onEdit, onDelete, onAssignStudents }) {
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-100 border-b-2 border-gray-300">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
              Class
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
              Fee Type
            </th>
            <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
              Amount
            </th>
            <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">
              Due Date
            </th>
            <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">
              Collection
            </th>
            <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee, index) => (
            <tr
              key={fee.id}
              className={`border-b transition hover:bg-indigo-50 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                {fee.className}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">{fee.fee_type}</td>
              <td className="px-6 py-4 text-sm font-semibold text-right text-gray-900">
                ₹{parseFloat(fee.amount).toFixed(2)}
              </td>
              <td className="px-6 py-4 text-sm text-center text-gray-600">
                {fee.due_date
                  ? new Date(fee.due_date).toLocaleDateString()
                  : "-"}
              </td>
              <td className="px-6 py-4 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getCollectionColor(
                    fee.collection_status?.collection_percentage || 0
                  )}`}
                >
                  {(fee.collection_status?.collection_percentage || 0).toFixed(1)}%
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(fee)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Edit"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => onAssignStudents(fee)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                    title="Assign to Students"
                  >
                    <FiUsers size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(fee.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GroupedView({ groupedFees, onEdit, onDelete, onAssignStudents }) {
  return (
    <div className="space-y-6">
      {Object.entries(groupedFees).map(([className, classFees]) => (
        <div
          key={className}
          className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
        >
          {/* Class Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
            <h3 className="text-lg font-bold text-white">{className}</h3>
            <p className="text-indigo-100 text-sm mt-1">
              {classFees.length} fee{classFees.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Fees in Class */}
          <div className="p-6">
            <div className="space-y-3">
              {classFees.map((fee) => (
                <div
                  key={fee.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {fee.fee_type}
                        </h4>
                        <div className="flex gap-4 mt-1 text-sm text-gray-600">
                          <span>₹{parseFloat(fee.amount).toFixed(2)}</span>
                          {fee.due_date && (
                            <span>
                              Due: {new Date(fee.due_date).toLocaleDateString()}
                            </span>
                          )}
                          <span
                            className={`font-semibold ${getCollectionColor(
                              fee.collection_status?.collection_percentage || 0
                            )}`}
                          >
                            {(
                              fee.collection_status?.collection_percentage || 0
                            ).toFixed(1)}
                            % collected
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => onEdit(fee)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                      title="Edit"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => onAssignStudents(fee)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition"
                      title="Assign to Students"
                    >
                      <FiUsers size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(fee.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getCollectionColor(percentage) {
  if (percentage === 0) return "text-red-600";
  if (percentage < 50) return "text-orange-600";
  if (percentage < 100) return "text-yellow-600";
  return "text-green-600";
}
