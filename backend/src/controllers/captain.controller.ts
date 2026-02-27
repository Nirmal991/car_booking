import { ApiError, ApiResponse, asyncHandler } from "../lib"
import { AuthRequest } from "../middlewares"
import { validationResult } from 'express-validator'
import { Captain } from "../models";


export const registerCaptain = asyncHandler(async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, "Validation failed", errors.array());
    }

    console.log("REGISTER: ", req.body);
    
    const { fullname, email, password, vehicle } = req.body;

    try {
        const isCaptainAlreadyExists = await Captain.findOne({ email: email })

        if (isCaptainAlreadyExists) {
            throw new ApiError(400, "Captain with this email already exists");
        }

        const hashedPassword = await Captain.hashPassword(password);

        const captain = await Captain.create({
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname
            },
            email,
            password: hashedPassword,
            vehicle: {
                color: vehicle.color,
                plate: vehicle.plate,
                capacity: vehicle.capacity,
                vehicleType: vehicle.vehicleType
            }
        });

        const token = await captain.generateAuthToken();

        return res
            .status(201)
            .cookie('token', token)
            .json(new ApiResponse(201, { token, captain }, "Captain created Successfully"))
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

export const LoginCaptain = asyncHandler(async (req: AuthRequest, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        throw new ApiError(400, "Validation failed", error.array());
    }

    const { email, password } = req.body;

    try {
        const captain = await Captain.findOne({ email }).select('+password');

        if (!captain) {
            throw new ApiError(400, "Invalid email or password");
        }

        const isMatch = await captain.comparePassword(password);

        if (!isMatch) {
            throw new ApiError(400, "Invalid email or password");
        }

        const token = await captain.generateAuthToken();

        return res
            .status(200)
            .cookie('token', token)
            .json(new ApiResponse(200, { token, captain }, "Login successfully"));
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

export const getCaptainProfile = asyncHandler(async (req: AuthRequest, res) => {
    try {
        const captain = req.captain;
        return res
        .status(200)
        .json(new ApiResponse(200, {captain}, "Captain profile fetched successfully"));
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
});

export const logoutCaptain = asyncHandler(async (req: AuthRequest, res) => {

    try {
        if(!req.captain?._id){
            throw new ApiError(401, "Unauthorized");
        }

        await Captain.findByIdAndUpdate(
            req.captain?._id,
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
        .clearCookie('token', options)
        .json(new ApiResponse(200, null, "Logout successfully"));
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
});