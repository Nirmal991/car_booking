import { ApiError, ApiResponse, asyncHandler } from "../lib";
import { User } from "../models";
import  { validationResult } from 'express-validator';

export const register = asyncHandler(async (req, res, next) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        throw new ApiError(400, "Validation failed", errors.array() )
    }

    console.log("BODY: ", req.body);
    const { fullname, email, password} = req.body;

    if(!fullname || !email || !password){
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
            password:hashedPassword
        })

        const token = user.generateAuthToken();

        return res
        .status(201)
        .json(new ApiResponse(201, {token, user}, "User created Successfully"))
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