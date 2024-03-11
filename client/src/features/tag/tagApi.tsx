import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Config } from "../../interfaces/interfaces";

interface Payload {
  id?: string;
  tag?: string;
  infoTag?: string;
  config?: Config;
  skip?: number;
  limit?: number;
}

export const getTagsThunk = createAsyncThunk(
  "tag/getTags",
  async ({ skip, limit }: Payload, { rejectWithValue }) => {
    try {
      const { data } = await axios(
        `${import.meta.env.VITE_BACKEND_URL}/tags?limit=${limit}&skip=${skip}`
      );
      return data;
    } catch (error) {
      rejectWithValue("error");
    }
  }
);

export const getTagThunk = createAsyncThunk(
  "tag/getTag",
  async ({ tag }: Payload, { rejectWithValue }) => {
    try {
      const { data } = await axios(
        `${import.meta.env.VITE_BACKEND_URL}/tags/${tag}`
      );
      return data;
    } catch (error) {
      rejectWithValue("error");
    }
  }
);

export const editTagThunk = createAsyncThunk(
  "tag/editTag",
  async ({ id, infoTag, config }: Payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/tags/edit/${id}`,
        { infoTag },
        config
      );
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.err);
      }
    }
  }
);
