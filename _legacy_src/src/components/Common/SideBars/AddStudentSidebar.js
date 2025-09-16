import React, { useState, useEffect } from "react";
import { GoLocation } from "react-icons/go";
import { RxCross1 } from "react-icons/rx";
import {
  BsFillPersonFill,
  BsFillCalendar2DateFill,
  BsBriefcase,
} from "react-icons/bs";
import {MdSchool} from 'react-icons/md';
import { Rings } from "react-loader-spinner";
import { AiOutlinePhone, AiFillBank } from "react-icons/ai";
import { HiOutlineCake } from "react-icons/hi";
import SelectionDropdown from "../../UI/SelectionDropdown";
import { API_URL } from "../../../helpers/URL";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { validateStudent } from "../../../helpers/ValidateStudent";
import { useNavigate } from "react-router-dom";
import {getAllSchoolData} from "../../School/helpers/dataFetcher";
import { setLoading, setSuccessToast, setWarningToast } from "../../../store/generalUser";
import { genderList } from "../../../helpers/inputLists";

export default function AddStudent({ setOpenAddProfile, classroom, subjects, studentData }) {
  const staff = useSelector((state) => state.staff.allStaff);
  const navigate = useNavigate();
  const session = useSelector((state) => state.user.session);

  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState(genderList[0]);
  const [mobileNO, setMobileNo] = useState("");
  const [dateOfAdmission, setDateOfAdmission] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDOB] = useState("");
  const [admissionNo, setAdmissionNo] = useState("");
  const [parentMobileNO, setParentMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [acountNo, setAcountNo] = useState("");
  const [motherName, setMotherName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const dispatch = useDispatch();
  const genderValue = String(gender.id || (gender.name === "Male" ? 1 : 2));

  function resetForm(){
    setProfileImage(null);
    setFatherName("");
    setFirstName("");
    setLastName("");
    setGender(genderList[0]);
    setMobileNo("");
    setDateOfAdmission("");
    setAddress("");
    setDOB("");
    setParentMobileNo("");
    setAdmissionNo("");
    setEmail("");
    setAcountNo("");
    setMotherName("");
    setRollNo("");
  }
  useEffect(()=>{
    if(!staff || staff.length===0)
    getAllSchoolData(dispatch, navigate, setLoading, session)
  },[staff])
  useEffect(()=>{

    if(studentData) {
      setLoading(true);
      console.log(studentData)
      setFirstName(studentData.first_name);
      setLastName(studentData.last_name);
      setFatherName(studentData.father_name);
      setAcountNo(studentData.parent_account_no);
      setAddress(studentData.address);
      setAdmissionNo(studentData.admission_no);
      setEmail(studentData.contact_email);
      setDOB(studentData.date_of_birth);
      setDateOfAdmission(studentData.date_of_admission);
      setGender(
        studentData.gender === "2"
          ? {
              id: 2,
              name: "Female",
            }
          : {
              id: 1,
              name: "Male",
            }
      );
      setMotherName(studentData.mother_name);
      setParentMobileNo(studentData.parent_mobile_number);
      setRollNo(studentData.roll_no);
      setLoading(false);
    }
  },[])
  const submit = async () => {
      setLoading(true);
      if(studentData){
        if(validateStudent(firstName,lastName, dateOfAdmission, acountNo, profileImage, parentMobileNO, email, dispatch, false)){
          try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            if (profileImage) {
              formData.append("profile_pic", profileImage);
            }
            formData.append("first_name", firstName);
            formData.append("last_name", lastName);
            formData.append("gender", genderValue);
            formData.append("contact_email", email);
            formData.append("date_of_admission", dateOfAdmission);
            formData.append("roll_no", rollNo);
            formData.append("parent_mobile_number", parentMobileNO);
            formData.append("father_name",fatherName);
            formData.append("mother_name",motherName);
            formData.append("date_of_birth", dob);
            formData.append("address", address);
            formData.append("parent_account_no", acountNo);
            formData.append("admission_no", admissionNo);
           
            const res = await axios.patch(
              API_URL + "staff/student/" + studentData.user.id + "/",
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
              console.log("This is the response :  ", res);
              if(res.status===200 && res.data.non_field_errors && res.data.non_field_errors[0] === 'The fields school, roll_no, admission_no, classroom must make a unique set.'){
                dispatch(setWarningToast("Admission Number must be unique"));
              }
            if (res.status === 200) {
              dispatch(setSuccessToast("Student Updated Successfully"));
              console.log("response returned", res);
              resetForm();
            }
          } catch (e) {
            console.warn("Error ::::::", e);
          }
        }
      }
      else {
        console.log("Adding new student");
        if(validateStudent(firstName,lastName, dateOfAdmission, acountNo, profileImage, parentMobileNO, email, dispatch)){
          try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("profile_pic", profileImage);
            formData.append("first_name", firstName);
            formData.append("last_name", lastName);
            formData.append("gender", genderValue);
            formData.append("contact_email", email);
            formData.append("date_of_admission", dateOfAdmission);
            formData.append("roll_no", rollNo);
            formData.append("parent_mobile_number", parentMobileNO);
            formData.append("father_name",fatherName);
            formData.append("mother_name",motherName);
            formData.append("date_of_birth", dob);
            formData.append("address", address);
            formData.append("parent_account_no", acountNo);

            formData.append("classroom", classroom.id);

            formData.append("admission_no", admissionNo);

            const res = await axios.post(
              API_URL + "staff/student/",
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                params : {
                  session : localStorage.getItem("session")
                }
              }
            );
              console.log("This is the response :  ", res);
              if(res.status===200 && res.data.non_field_errors && res.data.non_field_errors[0] === 'The fields school, roll_no, admission_no, classroom must make a unique set.'){
                dispatch(setWarningToast("Admission Number must be unique"));
              }
            if (res.status === 201) {
              dispatch(setSuccessToast("Student Added Successfully"));
              console.log("response returned", res);
              resetForm();
            }
            else {
              dispatch(setWarningToast("Error in Adding Student"));

            }
          } catch (e) {
            console.warn("Error ::::::", e);
          }
        }
      }
      setLoading(false);
  };

  return (
    <div className="z-20 fixed top-0 right-0 h-full pt-8 overflow-y-scroll bg-white w-[30rem] md:w-[55rem]">
      <div
        onClick={() => setOpenAddProfile(false)}
        className="absolute p-2 bg-gray-200 rounded-full top-8 left-8"
      >
        <RxCross1 />
      </div>

      <div className="flex flex-col items-center justify-center w-full">
        <p className="mt-8 mb-8 text-2xl font-semibold">
          {studentData ? "Edit Student" : "Add Student"}
        </p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <Rings
            height="220"
            width="220"
            // radius="9"
            color="rgb(30 64 175)"
            ariaLabel="loading"
          />{" "}
        </div>
      ) : (<>
     
      <div className="flex flex-col mx-4 mt-4">
        <p className="mb-4 text-xl font-semibold text-gray-800">
          Personal Details
        </p>
        
        <div className="flex flex-col justify-between mb-4 md:flex-row">

        <div className="flex flex-row items-center mt-2 mb-4">
          <BsFillPersonFill className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center">
            <span className="mb-1 font-semibold text-gray-800 text-md">
              First Name
            </span>
            <input
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              type="text"
              placeholder="First Name"
              className="flex px-3 py-2 font-medium border-2 border-black rounded-lg placeholder:font-normal w-[300px] sm:w-[350px]"
            />
          </div>
        </div>
        <div className="flex flex-row items-center mt-2 mb-4">
          <BsFillPersonFill className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center">
            <span className="mb-1 font-semibold text-gray-800 text-md">
              Last Name
            </span>
            <input
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              type="text"
              placeholder="Last Name"
              className="flex px-3 py-2 font-medium border-2 border-black rounded-lg placeholder:font-normal w-[300px] sm:w-[350px]"
            />
          </div>
        </div>
        </div>
        <div className="flex flex-col justify-between mb-4 md:flex-row">

        <div className="flex flex-row items-center mt-2 mb-4">
          <BsFillPersonFill className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center">
            <span className="mb-1 font-semibold text-gray-800 text-md">
              Fathers Name
            </span>
            <input
              onChange={(e) => setFatherName(e.target.value)}
              value={fatherName}
              type="text"
              placeholder="Father's Name"
              className="flex px-3 py-2 font-medium border-2 border-black rounded-lg placeholder:font-normal w-[300px] sm:w-[350px]"
            />
          </div>
        </div>
        <div className="flex flex-row items-center mt-2 mb-4">
          <BsFillPersonFill className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center">
            <span className="mb-1 font-semibold text-gray-800 text-md">
              Mothers Name
            </span>
            <input
              onChange={(e) => setMotherName(e.target.value)}
              value={motherName}
              type="text"
              placeholder="Mother's Name"
              className="flex px-3 py-2 font-medium border-2 border-black rounded-lg placeholder:font-normal w-[300px] sm:w-[350px]"
            />
          </div>
        </div>
        </div>
        <div className="flex flex-col justify-between mb-4 md:flex-row">

        <div className="flex flex-row items-center mt-2 mb-4">
          <AiOutlinePhone className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center">
            <span className="mb-1 font-semibold text-gray-800 text-md">
              Phone Number
            </span>
            <input
              onChange={(e) => setMobileNo(e.target.value)}
              value={mobileNO}
              type="number"
              maxLength={10}
              placeholder="Phone No"
              className="flex px-3 py-2 font-medium border-2 border-black rounded-lg placeholder:font-normal w-[300px] sm:w-[350px]"
            />
          </div>
        </div>
        <div className="flex flex-row items-center mt-2 mb-4">
          <AiOutlinePhone className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center">
            <span className="mb-1 font-semibold text-gray-800 text-md">
              Parents Phone Number
            </span>
            <input
              onChange={(e) => setParentMobileNo(e.target.value)}
              value={parentMobileNO}
              maxLength={10}
              type="number"
              placeholder="Parental Phone No"
              className="flex px-3 py-2 font-medium border-2 border-black rounded-lg placeholder:font-normal w-[300px] sm:w-[350px]"
            />
          </div>
        </div>
        </div>

        <div className="flex flex-row items-center mt-2 mb-4">
          <BsFillPersonFill className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center w-[300px] sm:w-[350px] md:w-full">
            <span className="mb-1 font-semibold text-gray-800 text-md">
              Gender
            </span>
            <SelectionDropdown
              inputList={genderList}
              labelTitle=""
              DivWidth="full"
              selected={gender}
              setSelected={setGender}
            />
          </div>
        </div>
        <div className="flex flex-col justify-between mb-4 md:flex-row">

        <div className="flex flex-row items-center mt-4">
          <BsBriefcase className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center ">
            <span className="mb-1 font-semibold text-gray-800 text-md">
              Email Address
            </span>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
              placeholder="Email"
              className="flex px-3 py-2 font-medium w-[300px] sm:w-[350px] border-2 border-black rounded-lg placeholder:font-normal"
            />
          </div>
        </div>
        <div className="flex flex-row items-center mt-4">
          <MdSchool className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center ">
            <span className="mb-1 font-semibold text-gray-800 text-md">
              Admission Number
            </span>
            <input
              onChange={(e) => setAdmissionNo(e.target.value)}
              value={admissionNo}
              type="text"
              placeholder="Admission Number"
              className="flex px-3 py-2 font-medium w-[300px] sm:w-[350px] border-2 border-black rounded-lg placeholder:font-normal"
            />
          </div>
        </div>
        </div>
        <div className="flex flex-col justify-between mb-4 md:flex-row">

        <div className="flex flex-row items-center mt-4">
          <MdSchool className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center ">
            <span className="mb-1 font-semibold text-gray-800 text-md">
              Roll Number
            </span>
            <input
              onChange={(e) => setRollNo(e.target.value)}
              value={rollNo}
              type="text"
              placeholder="Roll Number"
              className="flex px-3 py-2 font-medium w-[300px] sm:w-[350px] border-2 border-black rounded-lg placeholder:font-normal"
            />
          </div>
        </div>
        <div className="flex flex-row items-center mt-4">
          <AiFillBank className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center ">
            <span className="mb-1 font-semibold text-gray-800 text-md">
              Account Number
            </span>
            <input
              onChange={(e) => setAcountNo(e.target.value)}
              value={acountNo}
              type="text"
              placeholder="Acount No"
              className="flex px-3 py-2 font-medium w-[300px] sm:w-[350px] border-2 border-black rounded-lg placeholder:font-normal"
            />
          </div>
        </div>
        </div>
        <div className="flex flex-col justify-between mb-4 md:flex-row">

        <div className="flex flex-row items-center mt-4">
          <HiOutlineCake className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center">
            <span className="mb-1 font-semibold text-gray-800 text-md">
              Date of Birth
            </span>
            <input
              value={dob}
              onChange={(e) => setDOB(e.target.value)}
              type="date"
              placeholder="Phone No"
              className="flex px-3 py-2 font-medium border-2 border-black rounded-lg placeholder:font-normal w-[300px] sm:w-[350px] mb-4"
            />
          </div>
        </div>
        <div className="flex flex-row items-center mt-4">
          <BsFillCalendar2DateFill className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center">
            <span className="mb-1 font-semibold text-gray-800 text-md">
              Date of Admission
            </span>
            <input
              onChange={(e) => setDateOfAdmission(e.target.value)}
              type="date"
              value={dateOfAdmission}
              placeholder="Phone No"
              className="flex w-full px-3 py-2 font-medium border-2 border-black rounded-lg placeholder:font-normal w-[300px] sm:w-[350px] mb-4"
            />
          </div>
        </div>
        </div>
        <div className="flex flex-row items-center mt-4 ">
          <GoLocation className="w-8 h-8 mb-2 mr-4 text-indigo-700" />
          <div className="flex flex-col items-start justify-center w-full">
            <span className="mb-1 font-semibold text-gray-800 text-md">
              Address
            </span>
            <textarea
            value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              className="flex w-full px-3 py-2 font-medium border-2 border-black rounded-lg placeholder:font-normal w-[300px] sm:w-[350px] md:w-full "
            />
          </div>
        </div>
        <div className="flex flex-col items-start justify-center w-full p-8 pt-2 mt-6 md:px-0">
          <span className="mb-4 font-semibold text-gray-800 text-md">
            Profile Picture
          </span>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 "
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  aria-hidden="true"
                  className="w-10 h-10 mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500 ">
                  <span className="text-xl font-semibold"> {profileImage ? profileImage.name :  "Student Profile Image"}</span>
                </p>

                <p className="mb-2 text-sm text-gray-500 ">
                  <span className="font-semibold">{profileImage ? "Click to Change" : "Click to upload"}</span>
                </p>
                <p className="text-xs text-gray-500 ">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={(e) => {
                
                  if(e.target.files[0].type.substring(0,5)==="image")  {
                    if(e.target.files[0].size < 1000000)setProfileImage(e.target.files[0]);
                    else dispatch(setWarningToast("Please select an image smaller than 1MB"))
                  }
                      else dispatch(setWarningToast("Please select an Image"))
                }}
                  
              />
            </label>
          </div>
        </div>
        
      </div>
      <div className="flex w-full px-8 mb-16">
        <button
          onClick={() => submit()}
          className="w-full py-2 mx-8 my-4 font-semibold text-white duration-200 ease-in-out bg-indigo-500 rounded-lg text-md hover:bg-indigo-800"
        >
          Save
        </button>
      </div>
      </>)}
    </div>
  );
}
