import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'


// register:
export const register = createAsyncThunk(
  'users/register', 
  async({first_name, last_name, email, password}, thunkAPI) => {
    const body = JSON.stringify({
      first_name,
      last_name,
      email,
      password
    });
    
    try {
      const res = await fetch(
        '/api/users/register', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body,
          });

      // on successful request (register.js data), send back user data,
      // as seen in 'django/users/views.py'
      const data = await res.json();

      // successful if response status is 201:
      if (res.status === 201) {
        return data;
      } else {
        // failure:
        // users/register/rejected
        console.log('Coco - api/users/register/rejected');
        console.log('Coco - res.ok = ', res.ok);

        // thunkAPI connects to our userSlice function.
        return thunkAPI.rejectWithValue(data);
      }
    } catch(err) {
      // in situation where we don't have the actual data:
      console.log('Coco - Data not received. No data to print.');
      console.log('Coco - Forced to catch error.');
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// getUser
// '_' means parameter won't have any value, that it won't be passed.
const getUser = createAsyncThunk('users/me', async (_, thunkAPI) => {

    try{
      // cookies will come along the way with this request
      const res = await fetch('api/users/me', {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      });

      const data = await res.json();

      if (res.status === 200) {
        // success - return data as a payload
        return data; 
      } else {
        // failure - reject with rejected data.
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err) {
      // error - print error data
      return thunkAPI.rejectWithValue(err.response.data);
    }
});

// login
export const login = createAsyncThunk(
  'users/login', 
  async({ email, password }, thunkAPI) => {
    const body = JSON.stringify({
      email,
      password
    });
    
    try {
      const res = await fetch(
        '/api/users/login', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body,
          });

      // on successful request (login.js data), send back user data,
      // as seen in 'django/users/views.py'
      const data = await res.json();

      // successful if response status is 201:
      if (res.status === 200) {
        // success

        const { dispatch } = thunkAPI;

        // use our getUser() function
        dispatch(getUser());

        return data;
      } else {
        // failure:
        // users/login/rejected
        console.log('Coco - api/users/login/rejected');
        console.log('Coco - res.ok = ', res.ok);

        // thunkAPI connects to our userSlice function.
        return thunkAPI.rejectWithValue(data);
      }
    } catch(err) {
      // in situation where we don't have the actual data:
      console.log('Coco - Data not received for login. No data to print.');
      console.log('Coco - Forced to catch error.');
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);


// logout
export const logout = createAsyncThunk(
  'users/logout', 
  async( _, thunkAPI ) => {
    
    try {
      const res = await fetch(
        '/api/users/logout', {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
          });

      const data = await res.json();

      // successful if response status is 200:
      if (res.status === 200) {
        // success on logout
        return data;
      } else {
        // failure:
        // users/logout/rejected
        console.log('Coco - api/users/logout/rejected');
        console.log('Coco - res.ok = ', res.ok);

        // thunkAPI connects to our userSlice function.
        return thunkAPI.rejectWithValue(data);
      }
    } catch(err) {
      console.log('Coco - Forced to catch error.');
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);


const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  registered: false,
}


// slice/ state manager
const userSlice = createSlice({
  name: 'user',
  initialState,
  // reducers are used for synchronous dispatches
  reducers: {
    resetRegistered: state => {
      state.registered = false;
    },
  },

  extraReducers: builder => {
    builder
      // registration:
      .addCase( register.pending, state => {
          // Do what we need to the state within this reducer
          // Because we have immer, we can adjust the state directly
          //  instead of returning data.
          state.loading = true; // loading is used for spinners/progress indicators
      })
      .addCase( register.fulfilled, state => {
        // 'fulfilled' means everything was successful
        // so we can set this user to be registered.
        // they will later be redirected to the login page.
        state.loading = false;
        state.registered = true;
      })
      .addCase( register.rejected, state => {
        state.loading = false;
      })
      // login:
      .addCase( login.pending, state => {
        state.loading = true;
      })
      .addCase( login.fulfilled, state => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase( login.rejected, state => {
        state.loading = false;
      })
      // get user:
      .addCase( getUser.pending, state => {
        state.loading = true;
      })
      .addCase( getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // user state = user data
      })
      .addCase( getUser.rejected, state => {
        state.loading = false;
      })

      // logout:
      .addCase( logout.pending, state => {
        state.loading = true;
      })
      .addCase( logout.fulfilled, state => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase( logout.rejected, state => {
        state.loading = false;
      });

    
  },
});

export const { resetRegistered } = userSlice.actions;
export default userSlice.reducer;