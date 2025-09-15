import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../helpers/URL";
import { useDispatch } from "react-redux";
import { setSuccessToast, setWarningToast } from "../../../store/generalUser";
import { IoMdClose } from "react-icons/io";
import { Rings } from "react-loader-spinner";

export default function StudentFeesAssignmentModal({
  isOpen,
  fee,
  classroom,
  onClose,
}) {
  const dispatch = useDispatch();
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [concessions, setConcessions] = useState([
    { id: "none", title: "No Concession", value: 0 },
  ]);
  const [defaultConcession, setDefaultConcession] = useState("none");

  useEffect(() => {
    if (isOpen && classroom) {
      fetchStudentsAndConcessions();
    }
  }, [isOpen, classroom, fee]);

  const fetchStudentsAndConcessions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const studentRes = await axios.get(API_URL + "staff/student/", {
        headers,
        params: { classroom: classroom.id },
      });

      setStudents(
        studentRes.data.map((student) => ({
          ...student,
          concession: "none",
        }))
      );

      setConcessions([
        { id: "none", title: "No Concession", value: 0 },
        { id: "50", title: "50% Concession", value: 50 },
        { id: "25", title: "25% Concession", value: 25 },
        { id: "10", title: "10% Concession", value: 10 },
      ]);
    } catch (error) {
      console.error("Error fetching students:", error);
      dispatch(setWarningToast("Failed to load students"));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStudent = (studentId) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedStudents.size === students.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(students.map((s) => s.id)));
    }
  };

  const handleConcessionChange = (studentId, concessionId) => {
    const updatedStudents = students.map((student) =>
      student.user.id === studentId
        ? { ...student, concession: concessionId }
        : student
    );
    setStudents(updatedStudents);
  };

  const handleApplyBulkConcession = () => {
    selectedStudents.forEach((studentId) => {
      handleConcessionChange(studentId, defaultConcession);
    });
    dispatch(
      setSuccessToast(`Applied concession to ${selectedStudents.size} students`)
    );
    setSelectedStudents(new Set());
  };

  const calculateFinalAmount = (concessionId) => {
    const concession =
      concessions.find((c) => c.id === concessionId) || concessions[0];
    const discount = (parseFloat(fee.amount) * concession.value) / 100;
    return (parseFloat(fee.amount) - discount).toFixed(2);
  };

  const handleSubmit = async () => {
    if (students.length === 0) {
      dispatch(setWarningToast("No students in this class"));
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const paymentData = students.map((student) => {
        const concession =
          concessions.find((c) => c.id === student.concession) ||
          concessions[0];
        const finalAmount = calculateFinalAmount(student.concession);

        return {
          student_id: student.user.id,
          fee_id: fee.id,
          amount_paid: finalAmount,
          payment_mode: "1",
          payment_date: new Date().toISOString().split("T")[0],
          reference: `${student.first_name} ${student.last_name} - ${fee.fee_type}`,
        };
      });

      for (const payment of paymentData) {
        await axios.post(API_URL + "student/fees/", payment, { headers });
      }

      dispatch(
        setSuccessToast(
          `Fees assigned to ${students.length} students successfully`
        )
      );
      onClose();
    } catch (error) {
      console.error("Error assigning fees:", error);
      dispatch(
        setWarningToast(
          error.response?.data?.message || "Failed to assign fees"
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Assign {fee?.fee_type} to Students
            </h2>
            <p className="text-indigo-100 text-sm mt-1">
              {classroom?.class_name} - {classroom?.section_name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-indigo-800 p-1 rounded transition"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Rings
              height="150"
              width="150"
              color="rgb(30 64 175)"
              ariaLabel="loading"
            />
          </div>
        ) : (
          <div className="p-6">
            {/* Fee Info */}
            <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">
                    Fee Amount
                  </p>
                  <p className="text-2xl font-bold text-blue-700">
                    ₹{parseFloat(fee?.amount).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">
                    Total Students
                  </p>
                  <p className="text-2xl font-bold text-blue-700">
                    {students.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">
                    Selected
                  </p>
                  <p className="text-2xl font-bold text-blue-700">
                    {selectedStudents.size}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">
                    Due Date
                  </p>
                  <p className="text-lg font-bold text-blue-700">
                    {fee?.due_date
                      ? new Date(fee.due_date).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">
                Bulk Concession Assignment
              </h3>
              <div className="flex flex-col md:flex-row gap-3">
                <select
                  value={defaultConcession}
                  onChange={(e) => setDefaultConcession(e.target.value)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                >
                  {concessions.map((concession) => (
                    <option key={concession.id} value={concession.id}>
                      {concession.title} ({concession.value}%)
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleApplyBulkConcession}
                  disabled={selectedStudents.size === 0}
                  className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply to Selected ({selectedStudents.size})
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedStudents.size === students.length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-gray-700">
                      Roll No.
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                      Concession
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-bold text-gray-700">
                      Final Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr
                      key={student.user.id}
                      className={`border-b transition hover:bg-indigo-50 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-3">
                        <input
                          type="checkbox"
                          checked={selectedStudents.has(student.user.id)}
                          onChange={() => handleSelectStudent(student.user.id)}
                          className="w-4 h-4 cursor-pointer"
                          id={`select-${student.user.id}`}
                        />
                      </td>
                      <td className="px-6 py-3 text-sm font-semibold text-gray-900">
                        {student.first_name} {student.last_name}
                      </td>
                      <td className="px-6 py-3 text-sm text-center text-gray-700">
                        {student.roll_no}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <select
                          value={student.concession}
                          onChange={(e) =>
                            handleConcessionChange(student.user.id, e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 text-sm"
                        >
                          {concessions.map((concession) => (
                            <option key={concession.id} value={concession.id}>
                              {concession.title} ({concession.value}%)
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-3 text-sm font-bold text-right text-gray-900">
                        ₹{calculateFinalAmount(student.concession)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">
                    Total to Collect
                  </p>
                  <p className="text-xl font-bold text-green-700">
                    ₹
                    {students
                      .reduce((sum, s) => sum + parseFloat(calculateFinalAmount(s.concession)), 0)
                      .toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">
                    Total Discount
                  </p>
                  <p className="text-xl font-bold text-orange-700">
                    ₹
                    {(
                      students.length * parseFloat(fee?.amount) -
                      students.reduce(
                        (sum, s) => sum + parseFloat(calculateFinalAmount(s.concession)),
                        0
                      )
                    ).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">
                    Avg Per Student
                  </p>
                  <p className="text-xl font-bold text-blue-700">
                    ₹
                    {students.length > 0
                      ? (
                          students.reduce(
                            (sum, s) =>
                              sum + parseFloat(calculateFinalAmount(s.concession)),
                            0
                          ) / students.length
                        ).toFixed(2)
                      : 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 justify-end border-t-2 border-gray-200 pt-4 mt-6">
              <button
                onClick={onClose}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || students.length === 0}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Assigning..." : "Confirm & Assign"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
