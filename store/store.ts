import { configureStore } from "@reduxjs/toolkit";
import TaskSlice from "./TaskSlice";
import UserSlice from "./UserSlice";

const store = configureStore({
	reducer: {
		task: TaskSlice,
		user: UserSlice,
	},
});
export type RootState = ReturnType<typeof store.getState>;

export default store;
