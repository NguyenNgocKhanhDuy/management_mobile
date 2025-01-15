import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	token: "",
	id:"",
};

const UserSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setToken: (state, action) => {
			state.token = action.payload;

		},
		setId: (state,action) =>{
			state.id = action.payload
		}
	},
});
export const {setId} = UserSlice.actions;
export const { setToken } = UserSlice.actions;
export default UserSlice.reducer;
 