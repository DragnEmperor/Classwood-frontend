import { createSlice } from '@reduxjs/toolkit'

export const staffUserSlice = createSlice({
  name: 'staff',
  initialState: {
    staffData: {},
    AllClassroom : []
    
  },
  reducers: {
    addStaffDetails: (state, action) => {
   
      state.staffData = action.payload
    },
    fetchClassroom: (state, action) =>{
      state.AllClassroom = action.payload
    },
 
  },
})

// Action creators are generated for each case reducer function
export const { addStaffDetails, fetchClassroom } = staffUserSlice.actions

export default staffUserSlice.reducer