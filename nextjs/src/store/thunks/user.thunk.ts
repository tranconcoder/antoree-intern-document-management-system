import { LoginFormValues } from "@/app/validator/yup/login.yup";
import { RegisterFormValues } from "@/app/validator/yup/register.yup";
import { axiosInstance } from "@/services";
import { LoginResponse } from "@/types/response";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { HttpStatusCode } from "axios";

export const fetchLogin = createAsyncThunk(
  "user/fetchLogin",
  async (credentials: LoginFormValues) => {
    const response = await axiosInstance.post<LoginResponse>(
      "/auth/login",
      credentials
    );

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error("Đăng nhập thất bại!");
    }

    // Save tokens to localStorage
    const tokens = {
      accessToken: response.data.tokens.accessToken,
      refreshToken: response.data.tokens.refreshToken,
    };
    localStorage.setItem("tokens", JSON.stringify(tokens));

    return response.data;
  }
);

export const fetchRegister = createAsyncThunk(
  "user/fetchRegister",
  async (credentials: RegisterFormValues) => {
    // Remove confirmPassword from payload
    const { confirmPassword, ...payload } = credentials;

    const response = await axiosInstance.post<LoginResponse>(
      "/auth/register",
      payload
    );

    if (
      response.status !== HttpStatusCode.Created &&
      response.status !== HttpStatusCode.Ok
    ) {
      throw new Error("Đăng ký thất bại!");
    }

    // Save tokens to localStorage
    const tokens = {
      accessToken: response.data.tokens.accessToken,
      refreshToken: response.data.tokens.refreshToken,
    };
    localStorage.setItem("tokens", JSON.stringify(tokens));

    return response.data;
  }
);
