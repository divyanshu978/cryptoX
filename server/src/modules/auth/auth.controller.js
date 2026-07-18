import * as authService from "./auth.service.js";
import asyncHandler from "../../utils/asynchandler.js";
import ApiResponse from "../../utils/apiresponse.js";

export const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = asyncHandler(async (req, res) => {

    const result = await authService.loginUser(req.body);

    res.status(200).json(
        new ApiResponse(
            200,
            "Login successful",
            result
        )
    );

});

export const getProfile = asyncHandler(async (req, res) => {

    // const result = await authService.loginUser(req.body);

    res.status(200).json(
        new ApiResponse(
            200,
            "profile fetched succesfully",
            
        )
    );

});