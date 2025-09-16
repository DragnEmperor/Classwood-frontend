import { createSlice } from '@reduxjs/toolkit'

export const staffSlice = createSlice({
  name: 'staff',
  initialState: {
    allStaff: [],
    noOfStaffMember : 0,
  },
  reducers: {
    addAllStaff: (state, action) => {
   
      state.allStaff = action.payload
      state.noOfStaffMember = action.payload.length
    },
    removeStaffMember : (state, action) =>{
      console.log(action.payload);
      const staffMembers = state.allStaff.filter(function rmvStaff(staff){
        return staff.user.id !== action.payload.user.id
      });
      state.allStaff = staffMembers;
    }
  },
})

// Action creators are generated for each case reducer function
export const { addAllStaff, removeStaffMember } = staffSlice.actions

export default staffSlice.reducer