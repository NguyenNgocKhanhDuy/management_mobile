import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	id: "",
};

const TaskSlice = createSlice({
	name: "task",
	initialState,
	reducers: {
		setTaskId: (state, action) => {
			state.id = action.payload;
		},
	},
});

export const { setTaskId } = TaskSlice.actions;
export default TaskSlice.reducer;
