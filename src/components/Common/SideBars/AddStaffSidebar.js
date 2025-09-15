import React, { useState, useEffect } from "react";
import { GoLocation } from "react-icons/go";
import { RxCross1 } from "react-icons/rx";
import { setWarningToast, setSuccessToast } from "../../../store/generalUser";
import {
  BsFillPersonFill,
  BsFillCalendar2DateFill,
  BsBriefcase,
} from "react-icons/bs";
import { AiOutlinePhone, AiFillBank } from "react-icons/ai";
import { HiOutlineCake } from "react-icons/hi";
import SelectionDropdown from "../../UI/SelectionDropdown";
import { API_URL } from "../../../helpers/URL";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addAllStaff } from "../../../store/School/staffSlice";
import { useNavigate } from "react-router-dom";
import { getAllSchoolData } from "../../School/helpers/dataFetcher";
import { genderList } from "../../../helpers/inputLists";
import { Rings } from "react-loader-spinner";
export default function AddStaff({ setOpenAddProfile, staffData }) {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const session = useSelector((state) => state.user.session);

  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState(genderList[0]);
  const [mobileNO, setMobileNo] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDOB] = useState("");
  const [email, setEmail] = useState("");
  const [ifscCode, setIFSCCode] = useState("");
  const [acountNo, setAcountNo] = useState("");
  const [adharNumber, setAdharNumber] = useState("");
  const [staffId, setStaffId] = useState("");
  const [isClassTeacher, setIsClassTeacher] = useState(true);
  const genderValue = String(gender.id || (gender.name === "Male" ? 1 : 2));
  useEffect(() => {
    if (staffData) {
      // console.log(staffData);
      setFirstName(staffData.first_name);
      setLastName(staffData.last_name);
      setEmail(staffData.contact_email);
      setDateOfJoining(staffData.date_of_joining);
      setDOB(staffData.date_of_birth);
      setMobileNo(staffData.mobile_number);
      setAddress(staffData.address);
      setAcountNo(staffData.account_no);
      setGender(
        staffData.gender === "2"
          ? {
              id: 2,
              name: "Female",
            }
          : {
              id: 1,
              name: "Male",
            }
      );
    }
  }, []);

  const submit = async () => {
    if (!staffData) {
      if (
        firstName.length === 0 ||
        lastName.length === 0 ||
        dateOfJoining.length === 0 ||
        acountNo.length === 0
      ) {
        dispatch(setWarningToast("Fill the required details (*)"));
      } else if (mobileNO < 1000000000)
        dispatch(setWarningToast("Mobile no should be atleast 10 digits"));
      else if (mobileNO.length > 12)
        dispatch(setWarningToast("Phone number should be at max 12 digits"));
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
        dispatch(setWarningToast("Invalid email address"));
      } else {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          const formData = new FormData();
          if (profileImage) {
            formData.append("profile_pic", profileImage);
          }
          formData.append("first_name", firstName);
          formData.append("last_name", lastName);
          formData.append("gender", genderValue);
          formData.append("mobile_number", mobileNO.toString(10));
          formData.append("contact_email", email);
          formData.append("date_of_joining", dateOfJoining);
          formData.append("date_of_birth", dob);
          formData.append("address", address);
          formData.append("account_no", acountNo);
          formData.append("staff_id", staffId);
          formData.append("adhar", adharNumber);
          formData.append("ifsc_code", ifscCode);
          formData.append("is_teaching_staff", isClassTeacher);
          const res = await axios.post(API_URL + "list/staff/", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params : {
              session : localStorage.getItem("session")
            }
          });
          if (res.status === 201) {
            dispatch(setSuccessToast("Staff added Successfully"));
          }
          if(res.status ===200){
            dispatch(setWarningToast("Staff with same Details detected"));
          }
        } catch (e) {
          console.warn("Error :::::::", e);
        }
        setLoading(false);
        getAllSchoolData(dispatch, navigate, setLoading, session);
      }
    
    } else {
      if (
        firstName.length === 0 ||
        lastName.length === 0 ||
        dateOfJoining.length === 0
      ) {
        dispatch(setWarningToast("Fill the required details (*)"));
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
        dispatch(setWarningToast("Invalid email address"));
      } else if (mobileNO.length > 12)
        dispatch(setWarningToast("Phone number should be at max 12 digits"));
      else {
        try {
      setLoading(true);
          const token = localStorage.getItem("token");
          // console.log(token);
          const formData = new FormData();
          if (profileImage) {
            formData.append("profile_pic", profileImage);
          }
          formData.append("first_name", firstName);
          formData.append("last_name", lastName);
          formData.append("gender", genderValue);
          formData.append("mobile_number", mobileNO.toString(10));
          formData.append("contact_email", email);
          formData.append("date_of_joining", dateOfJoining);
          formData.append("school", staffData.school);
          formData.append("date_of_birth", dob);
          formData.append("address", address);
          formData.append("account_no", acountNo);
          formData.append("staff_id", staffId);
          formData.append("adhar", adharNumber);
          formData.append("ifsc_code", ifscCode);
          formData.append("is_teaching_staff", isClassTeacher);


          const res = await axios.patch(
            API_URL + "list/staff/" + staffData.user.id + "/",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (res.status === 200) {
            dispatch(setSuccessToast("Staff Updated"));
            // console.log("response returned", res);
          }
        } catch (e) {
          console.warn("Error :::::::", e);
        }
        setLoading(false);
    getAllSchoolData(dispatch, navigate, setLoading, session);
      }
    }
    
  };

  return (
    <div className="z-20 fixed top-0 right-0 h-full pt-8 overflow-y-scroll bg-white md:w-[55rem] shadow-lg">
      <div
        onClick={() => setOpenAddProfile(false)}
        className="absolute p-2 bg-gray-200 rounded-full cursor-pointer top-8 left-8"
      >
        <RxCross1 />
      </div>

      <div className="flex flex-col items-center justify-center w-full">
        <p className="mt-8 mb-8 text-2xl font-semibold">
          {!staffData ? "Add New Staff" : "Edit Staff"}
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
      ) : (
        <>
          <div className="flex flex-col mx-4 mt-4">
            <p className="mb-4 text-xl font-semibold text-gray-800">
              Personal Details
            </p>
            <div className="flex flex-col justify-between  md:flex-row my-8">
              <span
              onClick={()=> setIsClassTeacher(true)}
              className={`cursor-pointer py-3 mr-5 ${!isClassTeacher ? "bg-gray-50 text-gray-800" : "bg-gray-700 text-white"} bg-gray-50 border-gray-700 border flex-1 rounded flex justify-center items-center`}> 
                Teacher
              </span>
              <span 
              onClick={()=> setIsClassTeacher(false)}
              className={`cursor-pointer py-3 ml-5 ${isClassTeacher ? "bg-gray-50 text-gray-800" : "bg-gray-700 text-white"} bg-gray-50 border-gray-700 border flex-1 rounded flex justify-center items-center`}> 
                Non Teacher
              </span>
            </div>
            <div className="flex flex-col justify-between mb-4 md:flex-row">
              <div className="flex flex-row items-center mt-2 mb-4">
                <BsFillPersonFill className="w-8 h-8 mr-4 text-indigo-700" />
                <div className="flex flex-col items-start justify-center">
                  <span className="mb-1 font-semibold text-gray-800 text-md">
                    First Name*
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
                <BsFillPersonFill className="w-8 h-8 mr-4 text-indigo-700 " />
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
                <AiOutlinePhone className="w-8 h-8 mr-4 text-indigo-700" />
                <div className="flex flex-col items-start justify-center">
                  <span className="mb-1 font-semibold text-gray-800 text-md">
                    Phone Number*
                  </span>
                  <input
                    onChange={(e) => setMobileNo(e.target.value)}
                    value={mobileNO}
                    maxLength={10}
                    type="number"
                    placeholder="Phone No"
                    className="flex px-3 py-2 font-medium border-2 border-black rounded-lg placeholder:font-normal w-[300px] sm:w-[350px]"
                  />
                </div>
              </div>
              
              <div className="flex flex-row items-center mt-4 mb-4">
                <BsBriefcase className="w-8 h-8 mr-4 text-indigo-700" />
                <div className="flex flex-col items-start justify-center ">
                  <span className="mb-1 font-semibold text-gray-800 text-md">
                    Email Address*
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
            </div>

            <div className="flex flex-row items-center mb-4">
                <BsBriefcase className="w-8 h-8 mr-4 text-indigo-700" />
                <div className="flex flex-col items-start justify-center w-full">
                  <span className="mb-1 font-semibold text-gray-800 text-md">
                    Aadhar Number
                  </span>
                  <input
                    onChange={(e) => setAdharNumber(e.target.value)}
                    value={adharNumber}
                    type="text"
                    placeholder="Adhar Number"
                    className="flex w-full px-3 py-2 font-medium border-2 border-black rounded-lg placeholder:font-normal"
                  />
                </div>
              </div>
              <div className="flex flex-row items-center mt-4 mb-4">
                <BsBriefcase className="w-8 h-8 mr-4 text-indigo-700" />
                <div className="flex flex-col items-start justify-center w-full">
                  <span className="mb-1 font-semibold text-gray-800 text-md">
                    Staff ID
                  </span>
                  <input
                    onChange={(e) => setStaffId(e.target.value)}
                    value={staffId}
                    type="text"
                    placeholder="Staff ID"
                    className="flex w-full px-3 py-2 font-medium border-2 border-black rounded-lg placeholder:font-normal"
                  />
                </div>
              </div>
            <div className="flex flex-row items-center mt-2 mb-4">
              <BsFillPersonFill className="w-8 h-8 mr-4 text-indigo-700" />
              <div className="flex flex-col items-start justify-center w-[300px] sm:w-[350px] md:w-full ">
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
                <AiFillBank className="w-8 h-8 mr-4 text-indigo-700" />
                <div className="flex flex-col items-start justify-center ">
                  <span className="mb-1 font-semibold text-gray-800 text-md">
                    Account Number*
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
              <div className="flex flex-row items-center mt-4">
                <AiFillBank className="w-8 h-8 mr-4 text-indigo-700" />
                <div className="flex flex-col items-start justify-center ">
                  <span className="mb-1 font-semibold text-gray-800 text-md">
                    IFSC Code
                  </span>
                  <input
                    onChange={(e) => setIFSCCode(e.target.value)}
                    value={ifscCode}
                    type="text"
                    placeholder="IFSC Code"
                    className="flex px-3 py-2 font-medium w-[300px] sm:w-[350px] border-2 border-black rounded-lg placeholder:font-normal"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between mb-4 md:flex-row">
              <div className="flex flex-row items-center mt-4">
                <HiOutlineCake className="w-8 h-8 mr-4 text-indigo-700" />
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
                <BsFillCalendar2DateFill className="w-8 h-8 mr-4 text-indigo-700" />
                <div className="flex flex-col items-start justify-center">
                  <span className="mb-1 font-semibold text-gray-800 text-md">
                    Date of Joining*
                  </span>
                  <input
                    onChange={(e) => setDateOfJoining(e.target.value)}
                    type="date"
                    value={dateOfJoining}
                    placeholder="Phone No"
                    className="flex px-3 py-2 font-medium border-2 border-black rounded-lg placeholder:font-normal w-[300px] sm:w-[350px] mb-4"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center mt-4 mb-4">
              <GoLocation className="w-8 h-8 mr-4 text-indigo-700" />
              <div className="flex flex-col items-start justify-center w-full">
                <span className="mb-1 font-semibold text-gray-800 text-md">
                  Address
                </span>
                <textarea
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                  className="flex px-3 py-2 font-medium border-2 border-black rounded-lg placeholder:font-normal w-[300px] sm:w-[350px] md:w-full"
                />
              </div>
            </div>

            <div className="flex flex-col items-start justify-center w-full p-8 px-0 pt-2 mt-6">
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
                      <span className="text-xl font-semibold">
                        {" "}
                        {profileImage
                          ? profileImage.name
                          : "Staff profile Image"}
                      </span>
                    </p>

                    <p className="mb-2 text-sm text-gray-500 ">
                      <span className="font-semibold">
                        {profileImage ? "Click to Change" : "Click to upload"}
                      </span>
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
                      console.log(e.target.files[0])
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
        </>
      )}
    </div>
  );
}
