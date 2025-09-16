import { createSlice } from '@reduxjs/toolkit'

export const StudentSlice = createSlice({
  name: 'Student',
  initialState: {
    allStudent: [],
    noOfStudent : 0,
  },
  reducers: {
    addAllStudent: (state, action) => {
   
      state.allStudent = action.payload;
      state.noOfStudent = action.payload.length
    },
    removeStudentMember : (state, action) =>{
      console.log(action.payload);
      const StudentMembers = state.allStudent.filter(function rmvStudent(Student){
        return Student.user.id !== action.payload.user.id
      });
      state.allStudent = StudentMembers;
    }
  },
})

// Action creators are generated for each case reducer function
export const { addAllStudent, removeStudentMember } = StudentSlice.actions

export default StudentSlice.reducer