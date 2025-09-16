import { createSlice } from '@reduxjs/toolkit'

export const SyllabusSlice = createSlice({
  name: 'Syllabus',
  initialState: {
    allSyllabus: [],
    noOfSyllabus : 0,
  },
  reducers: {
    addAllSyllabus: (state, action) => {
   
      state.allSyllabus = action.payload;
      state.noOfSyllabus = action.payload.length
    },

  },
})

// Action creators are generated for each case reducer function
export const { addAllSyllabus } = SyllabusSlice.actions

export default SyllabusSlice.reducer