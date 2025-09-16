import { createSlice } from '@reduxjs/toolkit'

export const FeesSlice = createSlice({
  name: 'Fees',
  initialState: {
    allFees: [],
    concession : [{
      title : "No Concession",
      value : "0"
    },
    {
      title : "",
      value : ""
    }],
    feesStudents :  []
  },
  reducers: {
    addFees: (state, action) => {
      state.allFees.push({
        title : "",
        fees : ""
      });

    },
    updateTitle : (state, action) =>{
        state.allFees[action.payload.index].title = action.payload.value;
    },
    updateValue : (state, action) =>{
        state.allFees[action.payload.index].fees = action.payload.value;
    },
    addConcession: (state, action) => {
      state.concession.push({
        title : "",
        fees : ""
      });
    },
  updateConcessionTitle : (state, action) =>{
      state.concession[action.payload.index].title = action.payload.value;
  },
  updateConcessionValue : (state, action) =>{
      state.concession[action.payload.index].value = action.payload.value;
  },
  setFeesStudents : (state, action) =>{
    state.feesStudents = action.payload;
  },
  updateStudentConcession : (state, action) =>{
    state.feesStudents[action.payload.index].concession = action.payload.value;
  }
  },
})

// Action creators are generated for each case reducer function
export const { addFees, updateTitle, updateValue, addConcession, updateConcessionTitle, updateConcessionValue, setFeesStudents,updateStudentConcession } = FeesSlice.actions

export default FeesSlice.reducer