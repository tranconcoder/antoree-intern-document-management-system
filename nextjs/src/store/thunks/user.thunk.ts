import { LoginFormValues } from "@/app/validator/yup/login.yup";
import { RegisterApiPayload } from "@/app/validator/yup/register.yup";
import { axiosInstance } from "@/services";
import { LoginResponse } from "@/types/response";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { HttpStatusCode } from "axios";
import { persistor } from "..";

export const fetchLogin = createAsyncThunk(
  "user/fetchLogin",
  async (credentials: LoginFormValues) => {
    const response = await axiosInstance.post<{
      metadata: LoginResponse;
    }>("/auth/login", credentials);

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error("Đăng nhập thất bại!");
    }

    // Redux Persist sẽ tự động lưu state, không cần localStorage manual
    return response.data.metadata;
  }
);

export const fetchRegister = createAsyncThunk(
  "user/fetchRegister",
  async (credentials: RegisterApiPayload) => {
    const response = await axiosInstance.post<{
      metadata: LoginResponse;
    }>("/auth/register", credentials);

    if (response.status !== HttpStatusCode.Created) {
      throw new Error("Đăng ký thất bại!");
    }

    // Redux Persist sẽ tự động lưu state, không cần localStorage manual
    return response.data.metadata;
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { dispatch }) => {
    // Clear persisted state
    await persistor.purge();

    // Clear any remaining localStorage items
    if (typeof window !== "undefined") {
      localStorage.removeItem("tokens");
      localStorage.removeItem("persist:root");
    }

    return;
  }
);
