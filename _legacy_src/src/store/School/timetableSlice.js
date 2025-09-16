import { createSlice } from '@reduxjs/toolkit'

export const timeTableSlice = createSlice({
  name: 'timeTable',
  initialState: {
    timeTableRows: [
      [
        {
          subject : {
            name: "No Subject Selected",
          },
          teacher : "No Teacher",
          start : {
            hour : "0",
            minute : "0",
          },
          end : {
            hour : "0",
            minute : "0",
          }
        }
        
      ],
      [
        {
          subject : {
            name: "No Subject Selected",
          },
          teacher : "No Teacher",
          start : {
            hour : "0",
            minute : "0",
          },
          end : {
            hour : "0",
            minute : "0",
          }
        }
        
      ],
      [
        {
          subject : {
            name: "No Subject Selected",
          },
          teacher : "No Teacher",
          start : {
            hour : "0",
            minute : "0",
          },
          end : {
            hour : "0",
            minute : "0",
          }
        }
        
      ],
      [
        {
          subject : {
            name: "No Subject Selected",
          },
          teacher : "No Teacher",
          start : {
            hour : "0",
            minute : "0",
          },
          end : {
            hour : "0",
            minute : "0",
          }
        }
        
      ],
      [
        {
          subject : {
            name: "No Subject Selected",
          },
          teacher : "No Teacher",
          start : {
            hour : "0",
            minute : "0",
          },
          end : {
            hour : "0",
            minute : "0",
          }
        }
        
      ],
      [
        {
          subject : {
            name: "No Subject Selected",
          },
          teacher : "No Teacher",
          start : {
            hour : "0",
            minute : "0",
          },
          end : {
            hour : "0",
            minute : "0",
          }
        }
        
      ]
    ],
    commonTiming: [
      {
        subject : "",
       
        start : {
          hour : "0",
          minute : "0",
        },
        end : {
          hour : "0",
          minute : "0",
        }
      }
    ]
  
  },
  reducers: {
    addTimetableRow : (state, action) =>{
        state.timeTableRows[action.payload].push({
          subject : {
            name: "No Subject Selected",
          },
          teacher : "No Teacher",
          start : {
            hour : "0",
            minute : "0",
          },
          end : {
            hour : "0",
            minute : "0",
          }
        });
    },
    addCommonTimeTableRow : (state, action)=>{
      state.commonTiming.push({
        subject : "",
       
        start : {
          hour : "0",
          minute : "0",
        },
        end : {
          hour : "0",
          minute : "0",
        }
      })
    },
    refreshTimetableRow : (state, action) =>{
        state.timeTableRows = [
          [
            {
              subject : {
                name: "No Subject Selected",
              },
              teacher : "No Teacher",
              start : {
                hour : "0",
                minute : "0",
              },
              end : {
                hour : "0",
                minute : "0",
              }
            }
            
          ],
          [
            {
              subject : {
                name: "No Subject Selected",
              },
              teacher : "No Teacher",
              start : {
                hour : "0",
                minute : "0",
              },
              end : {
                hour : "0",
                minute : "0",
              }
            }
            
          ],
          [
            {
              subject : {
                name: "No Subject Selected",
              },
              teacher : "No Teacher",
              start : {
                hour : "0",
                minute : "0",
              },
              end : {
                hour : "0",
                minute : "0",
              }
            }
            
          ],
          [
            {
              subject : {
                name: "No Subject Selected",
              },
              teacher : "No Teacher",
              start : {
                hour : "0",
                minute : "0",
              },
              end : {
                hour : "0",
                minute : "0",
              }
            }
            
          ],
          [
            {
              subject : {
                name: "No Subject Selected",
              },
              teacher : "No Teacher",
              start : {
                hour : "0",
                minute : "0",
              },
              end : {
                hour : "0",
                minute : "0",
              }
            }
            
          ],
          [
            {
              subject : {
                name: "No Subject Selected",
              },
              teacher : "No Teacher",
              start : {
                hour : "0",
                minute : "0",
              },
              end : {
                hour : "0",
                minute : "0",
              }
            }
            
          ]
        ]
        state.commonTiming = [{
          subject : "",
         
          start : {
            hour : "0",
            minute : "0",
          },
          end : {
            hour : "0",
            minute : "0",
          }
        }]
         
    },
    updateTimetableSell : (state, action) =>{
      if(action.payload.type==="subject"){

        state.timeTableRows[action.payload.day][action.payload.columnIndex][action.payload.type] = action.payload.value;
        state.timeTableRows[action.payload.day][action.payload.columnIndex].teacher = action.payload.value.teacher;
        
      }
      else {
        state.timeTableRows[action.payload.day][action.payload.columnIndex][action.payload.type][action.payload.HorM] = action.payload.value;
        
      }
    },
    updateCommonTiming : (state, action) =>{
      console.log("here", action.payload.columnIndex, action.payload.value)
      if(action.payload.type==="subject"){
        console.log("insed")
      state.commonTiming[action.payload.columnIndex].subject = action.payload.value;

      }
      else  state.commonTiming[action.payload.columnIndex][action.payload.type][action.payload.HorM] = action.payload.value;

    }
   
  },
})

// Action creators are generated for each case reducer function
export const { addTimetableRow, refreshTimetableRow, updateTimetableSell, updateCommonTiming, addCommonTimeTableRow  } = timeTableSlice.actions

export default timeTableSlice.reducer