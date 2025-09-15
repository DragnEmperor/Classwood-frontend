import { setWarningToast } from "../store/generalUser";

function onlyNumbers(str) {
  return /^[0-9]*$/.test(str);
}

export function validateStudent(
  firstName,
  lastName,
  dateOfAdmission,
  acountNo,
  profileImage,
  mobileNO,
  email,
  dispatch,
  requireProfileImage = true
) {
    if (
        firstName.length === 0 ||
        lastName.length === 0 ||
        dateOfAdmission.length === 0 ||
        acountNo.length === 0 ||
        (requireProfileImage && !profileImage)
      ) {
        dispatch(setWarningToast("Fill complete Details"));
   
      } 
      else if(!onlyNumbers(mobileNO)) dispatch(setWarningToast("Mobile number should only contain numbers"));
      else if(mobileNO < 1000000000) dispatch(setWarningToast("Mobile no should be atleast 10 digits"))
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
        dispatch(setWarningToast("Invalid email address"));
      } 
      else {
          return true;
      }
      return false;
}
