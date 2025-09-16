import axios from "axios";
import {API_URL} from "../../../helpers/URL";
import { addStudentDetails, fetchSubjects } from "../../../store/Student/UserSlice";
export async function getAllDatatForStudentUser (dispatch){
    const token = localStorage.getItem('token');
    try{
        let res = await axios.get(API_URL + "student/me",{
      
            headers: {
              Authorization: `Bearer ${token}`,
            } 
        })
        dispatch(addStudentDetails(res.data))
    }
    catch(e){
        console.warn("Error ::: ", e);
    }
}
