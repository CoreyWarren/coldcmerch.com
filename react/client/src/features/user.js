import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    registered: false,
}


const userSlice = createSlice({
  name: 'user',
  initialState,
  // reducers are used for synchronous dispatches
  reducers: {
    resetRegistered: state => {
      state.registered = false;
    }
  },
})

export const { resetRegistered } = userSlice.actions
export default userSlice.reducer