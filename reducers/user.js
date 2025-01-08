import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    username: null,
    email: null,
    newVideoId: null,
    newVideoFilename: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      console.log(`- dans Redux: loginUser 🔔`);
      state.value.token = action.payload.token;
      state.value.username = action.payload.username;
      state.value.email = action.payload.email;
      console.log(`- finished loginUser 🏁`);
    },
    setNewVideoId: (state, action) => {
      state.value.newVideoId = action.payload.newVideoId;
      state.value.newVideoFilename = action.payload.fileName;
    },
    logoutUser: (state) => {
      console.log(`- dans Redux: logoutUser 🔔`);
      state.value.token = null;
      state.value.username = null;
      state.value.email = null;
      state.value.newVideoId = null;
      state.value.newVideoFilename = null;
      console.log(`- finished logoutUser 🏁`);
    },
  },
});

export const { loginUser, setNewVideoId, logoutUser } = userSlice.actions;
export default userSlice.reducer;
