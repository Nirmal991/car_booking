// import { getFair, getOTP } from "../config/ride.config";
// import { ApiError, asyncHandler } from "../lib";
// import { AuthRequest } from "../middlewares";
// import { validationResult } from 'express-validator';
// import { Ride } from "../models";

// export const createRide = asyncHandler(async (req: AuthRequest, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     const { userId, pickup, destination, vehicleType } = req.body;

//     if (!userId || !pickup || !destination || !vehicleType) {
//         throw new ApiError(400,'All fields are required');
//     }

//     try {
//         const fair = await getFair(pickup, destination);

//         const ride = Ride.create({
//             user: userId,
//             pickup,
//             destination,
//             otp: getOTP(6),
//             fare: fare[vehicleType]
//         })
//     } catch (error) {
//         console.error("Error: ", error);

//         if (error instanceof ApiError) {
//             return res.status(error.statusCode).json({
//                 success: false,
//                 message: error.message,
//                 errors: error.errors,
//             });
//         }

//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//             errors: [],
//         });
//     }
// })