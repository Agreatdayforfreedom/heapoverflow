import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Config, Question } from "../../interfaces/interfaces";

interface Payload {
  id?: string;
  payload?: {
    tags: string[];
    title: string;
    content: string;
  };
  config: Config;
}

export const getQuestionsThunk = createAsyncThunk(
  "question/getQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios(
        `${import.meta.env.VITE_BACKEND_URL}/question`
      );

      return data;
    } catch (error) {
      return rejectWithValue("error");
    }
  }
);

export const getQuestionThunk = createAsyncThunk(
  "question/getQuestion",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axios(
        `${import.meta.env.VITE_BACKEND_URL}/question/${id}`
      );
      return data;
    } catch (error) {
      return rejectWithValue("error");
    }
  }
);

export const createQuestionThunk = createAsyncThunk(
  "question/createQuestion",
  async ({ payload, config }: Payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/question/new`,
        payload,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue("error");
    }
  }
);

export const editQuestionThunk = createAsyncThunk(
  "question/editQuestion",
  async ({ payload, id, config }: Payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/question/update/${id}`,
        payload,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue("error");
    }
  }
);

export const removeQuestionThunk = createAsyncThunk(
  "question/removeQuestion",
  async ({ id, config }: Payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/question/delete/${id}`,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue("error");
    }
  }
);
