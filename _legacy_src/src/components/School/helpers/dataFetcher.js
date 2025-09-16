import { addAllStaff } from "../../../store/School/staffSlice";
import { addAllClassroom } from "../../../store/School/classroomSlice";
import { addAllStudent } from "../../../store/School/studentSlice";
import { API_URL } from "../../../helpers/URL";
import { addAllSyllabus } from "../../../store/School/syllabusSlice";
import { setNotice } from "../../../store/generalUser";
import axios from "axios";

export async function getAllSchoolData(dispatch, navigate, setLoading, session) {
  const updateLoading = typeof setLoading === "function" ? setLoading : () => {};
  updateLoading(true);
  const token = localStorage.getItem("token");
  const sessionId = session?.id || localStorage.getItem("session");
  if (!sessionId) {
    updateLoading(false);
    return;
  }
  try {
   
    const resStaff = await axios.get(API_URL + "list/staff/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
          session: sessionId,
      },
    });

    const resClassroom = await axios.get(API_URL + "list/classroom/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        session: sessionId,
    },
    });
    const resStudent = await axios.get(API_URL + "staff/student/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        session: sessionId,
    },
    });
    const syllabusRes = await axios.get(API_URL + "staff/syllabus/",{
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        session: sessionId,
    },
    })

    const resNotice = await axios.get(API_URL + "list/notice/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        session: sessionId,
    },
    });
    dispatch(setNotice(resNotice.data));
    dispatch(addAllSyllabus(syllabusRes.data))
    dispatch(addAllStaff(resStaff.data));
    dispatch(addAllClassroom(resClassroom.data));
    dispatch(addAllStudent(resStudent.data));
    
  } catch (e) {
    if (e.response && e.response.status === 401) {
      localStorage.removeItem("UserType");
      localStorage.removeItem("token");
      localStorage.removeItem("Payed");
      localStorage.removeItem("session");
      navigate(`/`);
    }
  }
  updateLoading(false);


}
export async function getLatestClassroom(dispatch, navigate,setLoading){
  const updateLoading = typeof setLoading === "function" ? setLoading : () => {};
  updateLoading(true);
  const token = localStorage.getItem("token");
  try {
    const resClassroom = await axios.get(API_URL + "list/classroom/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(addAllClassroom(resClassroom.data));

  } catch (e){
    if (e.response && e.response.status === 401) {
      localStorage.removeItem("UserType");
      localStorage.removeItem("token");
      localStorage.removeItem("Payed");
      localStorage.removeItem("session");
      navigate(`/`);
    }
  }
  updateLoading(false);

}
