import { createSlice } from "@reduxjs/toolkit";
import { Answer } from "../../interfaces/interfaces";
import {
  createAnswerThunk,
  deleteAnswerThunk,
  getAnswersThunk,
  getAnswerThunk,
  getRelatedAnswersThunk,
} from "./answerApi";

interface InitialState {
  answers: Answer[];
  total: number;
  answer: Answer | undefined;
  questionId: string | undefined;
  token: string;
  loading: boolean;
}

const token: string = localStorage.getItem("token") as string | "";

const initialState: InitialState = {
  answers: [],
  total: 0,
  answer: undefined,
  questionId: undefined,
  token,
  loading: true,
};

const answerSlice = createSlice({
  name: "answer",
  initialState,
  reducers: {
    clearState: () => initialState,
    setQuestionId: (state, action) => {
      state.questionId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAnswersThunk.pending, (state) => {
        state.loading = true;
        state.answers = [];
      })
      .addCase(getAnswersThunk.fulfilled, (state, action) => {
        state.answers = action.payload.answers;
        state.total = action.payload.countAnswers;
        state.loading = false;
      });
    builder
      .addCase(getAnswerThunk.pending, (state) => {
        state.loading = true;
        state.answer = undefined;
      })
      .addCase(getAnswerThunk.fulfilled, (state, action) => {
        state.answer = action.payload;
        state.loading = false;
      });
    builder
      .addCase(getRelatedAnswersThunk.pending, (state) => {
        state.loading = true;
        state.answers = [];
      })
      .addCase(getRelatedAnswersThunk.fulfilled, (state, action) => {
        state.answers = action.payload;
        state.loading = false;
      });
    builder
      .addCase(createAnswerThunk.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createAnswerThunk.fulfilled, (state, action) => {
        state.answers.push(action.payload);
        state.loading = false;
      });
    builder
      .addCase(deleteAnswerThunk.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteAnswerThunk.fulfilled, (state, action) => {
        state.answers = state.answers.filter(
          (x) => x._id !== action.payload.id
        );
        state.loading = false;
      });
  },
});

export const { setQuestionId, clearState } = answerSlice.actions;

export default answerSlice.reducer;
