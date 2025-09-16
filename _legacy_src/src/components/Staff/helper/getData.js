import axios from "axios";
import {API_URL} from "../../../helpers/URL";
import { addStaffDetails, fetchClassroom } from "../../../store/Staff/UserSlice";
export async function getAllDatatForStaffUser (dispatch){
    const token = localStorage.getItem('token');
    try{
        let res = await axios.get(API_URL + "staff/me",{
      
            headers: {
              Authorization: `Bearer ${token}`,
            } 
        })
        console.log("The response is : ", res);
        dispatch(addStaffDetails(res.data))
    }
    catch(e){
        console.warn("Error ::: ", e);
    }
}

export async function getAllImportantData(dispatch, setLoading, navigate){
    setLoading(true);
    const token = localStorage.getItem('token');
    try{
        let res = await axios.get(API_URL + "staff/classroom/",{
      
            headers: {
              Authorization: `Bearer ${token}`,
            } 
        })
        console.log("The response is : ", res);
        dispatch(fetchClassroom(res.data))
    }
    catch(e){
        console.warn("Error ::: ", e);
    }
    setLoading(false);
}