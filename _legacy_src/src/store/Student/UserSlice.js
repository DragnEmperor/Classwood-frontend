import { createSlice } from '@reduxjs/toolkit'

export const studentUserSlice = createSlice({
  name: 'student',
  initialState: {
    studentData: {},
    ALlSubjects : []
    
  },
  reducers: {
    addStudentDetails: (state, action) => {
   
      state.studentData = action.payload
    },
    fetchSubjects: (state, action) =>{
      state.ALlSubjects = action.payload
    },
 
  },
})

// Action creators are generated for each case reducer function
export const { addStudentDetails, fetchSubjects } = studentUserSlice.actions

export default studentUserSlice.reducer