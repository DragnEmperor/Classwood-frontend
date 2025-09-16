import { createSlice } from '@reduxjs/toolkit'

export const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    session: [],
  },
  reducers: {
    setAllSession: (state, action) => {
   
      state.session = action.payload
    },

  },
})

// Action creators are generated for each case reducer function
export const { setAllSession } = sessionSlice.actions

export default sessionSlice.reducer