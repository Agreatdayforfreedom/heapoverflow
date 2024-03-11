import { createSlice } from "@reduxjs/toolkit";
import { Tag } from "../../interfaces/interfaces";
import { editTagThunk, getTagsThunk, getTagThunk } from "./tagApi";

interface InitialState {
  tags: Tag[];
  tag: Tag | undefined;
  loading: boolean;
  total: number;
}

const initialState: InitialState = {
  tags: [],
  tag: undefined,
  loading: true,
  total: 0,
};

const tagSlice = createSlice({
  name: "tag",
  initialState,
  reducers: {
    clearState: (state) => {
      state.tag = undefined;
      state.loading = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTagsThunk.pending, (state, action) => {
        state.tags = [];
        state.loading = true;
        state.total = 0;
      })
      .addCase(getTagsThunk.fulfilled, (state, action) => {
        state.tags = action.payload.tags.sort(
          (a: Tag, b: Tag) => b.totalQuestions! - a.totalQuestions!
        );
        state.loading = false;
        state.total = action.payload.tagsCount;
      });
    builder
      .addCase(getTagThunk.pending, (state, action) => {
        state.tag = undefined;
        state.loading = true;
      })
      .addCase(getTagThunk.fulfilled, (state, action) => {
        state.tag = action.payload;
        state.loading = false;
      });
    builder
      .addCase(editTagThunk.pending, (state, action) => {
        state.tag = undefined;
        state.loading = true;
      })
      .addCase(editTagThunk.fulfilled, (state, action) => {
        state.tag = undefined;

        state.loading = false;
      });
  },
});

export const { clearState } = tagSlice.actions;

export default tagSlice.reducer;
