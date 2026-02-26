import { ApiError, ApiResponse, asyncHandler } from "../lib";
import { Request, Response } from "express";
import { User } from "../models";
import { validationResult } from 'express-validator';
import { AuthRequest } from "../middlewares";

export const register = asyncHandler(async (req, res, next) => {

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", errors.array())
  }

  console.log("BODY: ", req.body);
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    throw new ApiError(401, "all credentials are required");
  }

  try {

    const hashedPassword = await User.hashPassword(password);

    const user = await User.create({
      fullname: {
        firstname: fullname.firstname,
        lastname: fullname.lastname,
      },
      email,
      password: hashedPassword
    })

    const token = user.generateAuthToken();

    return res
      .cookie('token', token, {
        httpOnly: true
      })
      .status(201)
      .json(new ApiResponse(201, { token, user }, "User created Successfully"))
  } catch (error) {
    console.error("Error: ", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: [],
    });
  }
})

export const login = asyncHandler(async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    throw new ApiError(400, "Validation failed", error.array());
  }

  console.log("LOGIN: ", req.body);

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = await user.generateAuthToken();

    return res
      .cookie('token', token)
      .status(200)
      .json(new ApiResponse(200, { token, user }, "Login successfully"))
  } catch (error) {
    console.error("Error: ", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: [],
    });
  }
})

export const getUserProfile = asyncHandler(
  async (req: AuthRequest, res) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        req.user,
        "User profile fetched successfully"
      )
    );
  }
);

export const logout = asyncHandler(async (req: AuthRequest, res) => {

  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized");
  }

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        token: 1
      }
    },
    {
      new: true
    }
  )

  const options = {
        httpOnly: true,
        secure: true
    }


  return res
        .status(200)
        .clearCookie("token", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})