import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	id: "",
	idProject: "",
};

const TaskSlice = createSlice({
	name: "task",
	initialState,
	reducers: {
		setTaskId: (state, action) => {
			state.id = action.payload;
		},

		setIdProject: (state, action) => {
			state.idProject = action.payload;
		},
	},
});

export const { setTaskId, setIdProject } = TaskSlice.actions;
export default TaskSlice.reducer;
