import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "../../../helpers/URL";
import { Rings } from "react-loader-spinner";
import { setSuccessToast, setWarningToast } from "../../../store/generalUser";
import FeesDashboard from "./FeesDashboard";
import FeeFormModal from "./FeeFormModal";
import StudentFeesAssignmentModal from "./StudentFeesAssignmentModal";
import { getAllSchoolData } from "../../School/helpers/dataFetcher";
import { useNavigate } from "react-router-dom";

export default function FeesManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [view, setView] = useState("dashboard"); // dashboard, create, edit
  const [selectedFee, setSelectedFee] = useState(null);
  const [showStudentAssignment, setShowStudentAssignment] = useState(false);
  const [allFees, setAllFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const classrooms = useSelector((state) => state.classroom.allClasses);
  const session = useSelector((state) => state.user.session);
  
  useEffect(() => {
    fetchAllFees();
  }, [refreshTrigger, session]);

  useEffect(() => {
      if (!classrooms || classrooms.length === 0)
        getAllSchoolData(dispatch, navigate, setLoading, session);
    }, []);

  const fetchAllFees = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_URL + "list/fees/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          session: localStorage.getItem("session"),
        },
      });
      setAllFees(res.data);
    } catch (error) {
      console.error("Error fetching fees:", error);
      dispatch(setWarningToast("Failed to load fees"));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFee = () => {
    setSelectedFee(null);
    setView("create");
  };

  const handleEditFee = (fee) => {
    setSelectedFee(fee);
    setView("edit");
  };

  const handleDeleteFee = async (feeId) => {
    if (window.confirm("Are you sure you want to delete this fee?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(API_URL + `list/fees/${feeId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(setSuccessToast("Fee deleted successfully"));
        setRefreshTrigger((prev) => prev + 1);
      } catch (error) {
        console.error("Error deleting fee:", error);
        dispatch(setWarningToast("Failed to delete fee"));
      }
    }
  };

  const handleFormSubmit = () => {
    setView("dashboard");
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleAssignStudents = (fee) => {
    setSelectedFee(fee);
    setShowStudentAssignment(true);
  };

  const handleCloseModal = () => {
    setView("dashboard");
    setSelectedFee(null);
  };

  const handleAssignmentClose = () => {
    setShowStudentAssignment(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Layout>
      {loading && view === "dashboard" ? (
        <div className="flex items-center justify-center w-full h-screen">
          <Rings
            height="220"
            width="220"
            color="rgb(30 64 175)"
            ariaLabel="loading"
          />
        </div>
      ) : (
        <>
          {view === "dashboard" && (
            <FeesDashboard
              fees={allFees}
              classrooms={classrooms}
              onCreateFee={handleCreateFee}
              onEditFee={handleEditFee}
              onDeleteFee={handleDeleteFee}
              onAssignStudents={handleAssignStudents}
            />
          )}

          {(view === "create" || view === "edit") && (
            <FeeFormModal
              isOpen={true}
              isEdit={view === "edit"}
              fee={selectedFee}
              classrooms={classrooms}
              onClose={handleCloseModal}
              onSubmit={handleFormSubmit}
            />
          )}

          {showStudentAssignment && selectedFee && (
            <StudentFeesAssignmentModal
              isOpen={true}
              fee={selectedFee}
              classroom={classrooms.find((c) => c.id === selectedFee.classroom_id)}
              onClose={handleAssignmentClose}
            />
          )}
        </>
      )}
    </Layout>
  );
}
