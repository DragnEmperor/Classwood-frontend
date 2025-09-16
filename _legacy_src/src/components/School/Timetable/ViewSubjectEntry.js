import React, {useEffect, useState} from 'react'
import axios from 'axios';
import { API_URL } from '../../../helpers/URL';
import { Rings } from 'react-loader-spinner';
export default function ViewSubjectEntry({period, index}) {
    const [teacher, setTeacher] = useState({});
    const [loading, setLoading] = useState(false);
    async function getTeacher(){
      if(period && period.teacher){

        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios(API_URL + "list/staff/" + period.teacher + "/",{
          headers: {
                Authorization: `Bearer ${token}`,
              }
            })
            setTeacher(res.data);
            setLoading(false);
          }
    }
    useEffect(()=>{
        getTeacher()
    }, [period, index])
  return (
    <>
    {loading ? 
     <div className="flex items-center justify-center w-full h-full">

     <Rings
             height="220"
             width="220"
             // radius="9"
             color="rgb(30 64 175)"
             
             ariaLabel="loading"
           /> </div> :<div className="py-2 text-center " index={index}>
                  <div className="mx-2 my-2 rounded-lg bg-gray-50 shadow-xl border-l-4 py-4  px-3 border-[#4338CA] flex flex-col justify-start items-start">
                      <span className="text-md text-font-semibold">
                        {period.subject ? period.subject : "No Subject"}
                      </span>
                      <span className="text-sm text-gray-500 break-word">
                        {teacher.first_name ? teacher.first_name + " " + teacher.last_name : "Free Class"}
                      </span>
  
                  </div>
                </div> }
    
    </>
  )
}
