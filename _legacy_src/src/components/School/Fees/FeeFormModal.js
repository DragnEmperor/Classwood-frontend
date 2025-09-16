import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../helpers/URL";
import { useDispatch } from "react-redux";
import { setSuccessToast, setWarningToast } from "../../../store/generalUser";
import { IoMdAddCircleOutline, IoMdClose } from "react-icons/io";
import { MdDelete } from "react-icons/md";

export default function FeeFormModal({
  isOpen,
  isEdit,
  fee,
  classrooms,
  onClose,
  onSubmit,
}) {
  const dispatch = useDispatch();
  const [selectedClass, setSelectedClass] = useState(null);
  const [feeItems, setFeeItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && fee) {
      setSelectedClass(fee.classroom_id);
      setFeeItems([
        {
          id: fee.id,
          fee_type: fee.fee_type,
          amount: fee.amount,
          description: fee.description,
          due_date: fee.due_date,
        },
      ]);
    } else {
      setSelectedClass(classrooms && classrooms.length > 0 ? classrooms[0].id : null);
      setFeeItems([
        {
          id: null,
          fee_type: "",
          amount: "",
          description: "",
          due_date: "",
        },
      ]);
    }
    setErrors({});
  }, [isEdit, fee, classrooms]);

  const validateForm = () => {
    const newErrors = {};

    if (!selectedClass) {
      newErrors.class = "Please select a class";
    }

    feeItems.forEach((item, index) => {
      if (!item.fee_type) {
        newErrors[`fee_type_${index}`] = "Fee type is required";
      }
      if (!item.amount || isNaN(parseFloat(item.amount)) || parseFloat(item.amount) <= 0) {
        newErrors[`amount_${index}`] = "Please enter a valid amount";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddFeeItem = () => {
    setFeeItems([
      ...feeItems,
      {
        id: null,
        fee_type: "",
        amount: "",
        description: "",
        due_date: "",
      },
    ]);
  };

  const handleRemoveFeeItem = (index) => {
    if (feeItems.length > 1) {
      setFeeItems(feeItems.filter((_, i) => i !== index));
    } else {
      dispatch(setWarningToast("At least one fee item is required"));
    }
  };

  const handleFeeItemChange = (index, field, value) => {
    const updatedItems = [...feeItems];
    updatedItems[index][field] = value;
    setFeeItems(updatedItems);

    if (errors[`${field}_${index}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${field}_${index}`];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      dispatch(setWarningToast("Please fix the errors before submitting"));
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (isEdit) {
        const feeItem = feeItems[0];
        await axios.patch(
          API_URL + `list/fees/${feeItem.id}/`,
          {
            fee_type: feeItem.fee_type,
            amount: feeItem.amount,
            description: feeItem.description,
            due_date: feeItem.due_date || null,
          },
          { headers }
        );
        dispatch(setSuccessToast("Fee updated successfully"));
      } else {
        const payload = {
          for_class: selectedClass,
          fee_data: feeItems.map((item) => ({
            title: item.fee_type,
            fees: item.amount,
            description: item.description,
            due_date: item.due_date || null,
          })),
          student_data: [],
        };

        await axios.post(API_URL + "list/fees/", payload, { headers });
        dispatch(setSuccessToast("Fees created successfully"));
      }

      onSubmit();
    } catch (error) {
      console.error("Error submitting fees:", error);
      const errorMsg = error.response?.data?.message || "Failed to save fees";
      dispatch(setWarningToast(errorMsg));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedClassName =
    classrooms?.find((c) => c.id === selectedClass)?.class_name || "";
  const selectedSectionName =
    classrooms?.find((c) => c.id === selectedClass)?.section_name || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            {isEdit ? "Edit Fee" : "Create New Fee"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-indigo-800 p-1 rounded transition"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Class Selection */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-700 mb-2">
              Class/Section {!isEdit && "*"}
            </label>
            {isEdit ? (
              <div className="px-4 py-2 bg-gray-100 rounded-lg border border-gray-300">
                <span className="text-gray-600">
                  {selectedClassName} - {selectedSectionName}
                </span>
              </div>
            ) : (
              <select
                value={selectedClass || ""}
                onChange={(e) => setSelectedClass(e.target.value)}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${
                  errors.class
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-indigo-500"
                }`}
              >
                <option value="">Select a class</option>
                {classrooms?.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.class_name} - {classroom.section_name}
                  </option>
                ))}
              </select>
            )}
            {errors.class && (
              <p className="text-red-500 text-sm mt-1">{errors.class}</p>
            )}
          </div>

          {/* Fee Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Fee Details
            </h3>
            <div className="space-y-4">
              {feeItems.map((item, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-gray-300 transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    {/* Fee Type */}
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Fee Type *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Tuition, Transport, etc."
                        value={item.fee_type}
                        onChange={(e) =>
                          handleFeeItemChange(index, "fee_type", e.target.value)
                        }
                        className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none ${
                          errors[`fee_type_${index}`]
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-indigo-500"
                        }`}
                      />
                      {errors[`fee_type_${index}`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[`fee_type_${index}`]}
                        </p>
                      )}
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Amount (₹) *
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={item.amount}
                        onChange={(e) =>
                          handleFeeItemChange(index, "amount", e.target.value)
                        }
                        step="0.01"
                        min="0"
                        className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none ${
                          errors[`amount_${index}`]
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-300 focus:border-indigo-500"
                        }`}
                      />
                      {errors[`amount_${index}`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[`amount_${index}`]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Due Date */}
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Due Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={item.due_date}
                        onChange={(e) =>
                          handleFeeItemChange(index, "due_date", e.target.value)
                        }
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Description (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Monthly tuition fee"
                        value={item.description}
                        onChange={(e) =>
                          handleFeeItemChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  {!isEdit && feeItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFeeItem(index)}
                      className="mt-3 flex items-center text-red-600 hover:text-red-700 font-semibold transition"
                    >
                      <MdDelete className="mr-2" size={18} />
                      Remove Fee Item
                    </button>
                  )}
                </div>
              ))}
            </div>

            {!isEdit && (
              <button
                type="button"
                onClick={handleAddFeeItem}
                className="mt-4 flex items-center px-4 py-2 font-semibold text-indigo-700 hover:bg-indigo-50 rounded-lg transition"
              >
                <IoMdAddCircleOutline className="mr-2" size={20} />
                Add Another Fee Item
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end border-t-2 border-gray-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : isEdit ? "Update Fee" : "Create Fee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
