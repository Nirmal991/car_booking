import { validationResult } from "express-validator";
import { ApiError, ApiResponse, asyncHandler } from "../lib";
import { AuthRequest } from "../middlewares";
import { getServiceCoordinates } from "../config/map.config";
import { getDistance, getAutoCompleteSuggestion } from "../config/map.config";

export const getCoordinates = asyncHandler(async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new ApiError(400, "Invalid input", errors.array());
    }

    const { address } = req.query;

    try {
        const coordinates = await getServiceCoordinates(address as string);
        return res
        .status(200)
        .json(new ApiResponse(200, coordinates,"Corrdinates found"));
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

export const getDistanceTime = asyncHandler(async(req: AuthRequest, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new ApiError(400, "Invalid input", errors.array());
    }

    const { origin, destination } = req.query;

    try {
        const distanceTime = await getDistance(origin as string, destination as string);
        return res
        .status(200)
        .json(new ApiResponse(200, distanceTime, "Distance and time found"));
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

export const getAutoCompleteSuggestions = asyncHandler(async(req: AuthRequest, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new ApiError(400, "Invalid input", errors.array());
    }

    const { input } = req.query;
    try {
        const suggestions = await getAutoCompleteSuggestion(input as string);
        return res
        .status(200)
        .json(new ApiResponse(200, suggestions, "Suggestions found"));
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