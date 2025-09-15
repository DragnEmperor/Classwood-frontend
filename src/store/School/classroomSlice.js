import { createSlice } from '@reduxjs/toolkit'

export const classroomSlice = createSlice({
  name: 'classroom',
  initialState: {
    allClasses: [],
    addClassSubject : [{
      teacher:"",
      subjectname:""
    }],
    noOfClasses : 0,
  },
  reducers: {
    addAllClassroom: (state, action) => {
      state.allClasses = action.payload;
      state.noOfClasses = action.payload.length
    },
    addNewClassSubjectsTecher : (state, action)=>{
      state.addClassSubject[action.payload.id].teacher = action.payload.value
    },
    addNewClassSubjectsName : (state, action)=>{
      state.addClassSubject[action.payload.id].subjectname = action.payload.value
    },
    addAWholeSubject : (state, action) =>{
      state.addClassSubject.push(action.payload)
    },
    removeClass : (state, action) =>{
      const classesForSchool = state.allClasses.filter(function getClass(cls){
        return cls.id !== action.payload.id
      });
      state.allClasses = classesForSchool;
    }
  },
})

// Action creators are generated for each case reducer function
export const { addAllClassroom,addNewClassSubjectsTecher, addNewClassSubjectsName, addAWholeSubject, removeClass } = classroomSlice.actions

export default classroomSlice.reducer