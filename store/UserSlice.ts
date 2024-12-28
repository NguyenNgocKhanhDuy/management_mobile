import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	token: "",
};

const UserSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setToken: (state, action) => {
			state.token = action.payload;
		},
	},
});

export const { setToken } = UserSlice.actions;
export default UserSlice.reducer;
