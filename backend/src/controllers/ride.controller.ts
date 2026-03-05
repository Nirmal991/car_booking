import { getFair, getOTP } from "../config/ride.config";
import { ApiError, ApiResponse, asyncHandler, sendMessageToSocketId } from "../lib";
import { AuthRequest } from "../middlewares";
import { validationResult } from 'express-validator';
import { Ride } from "../models";
import { getAddressCoordinates, getCaptainsInTheRadius } from "../config/map.config";
import { VehicleType } from "../types/vehicle";


export const createRide = asyncHandler(async (req: AuthRequest, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.body;

  const { vehicleType } = req.body as { vehicleType: VehicleType };

  if (!pickup || !destination || !vehicleType) {
    throw new ApiError(400, "All fields are required");
  }

  // calculate fare
  const fare = await getFair(pickup, destination);

  // create ride
  const ride = await Ride.create({
    user: req.user?._id,
    pickup,
    destination,
    otp: getOTP(6),
    fare: fare[vehicleType],
  });

  // get pickup coordinates
  const pickupCoordinates = await getAddressCoordinates(pickup);

  // find nearby captains
  const captains = await getCaptainsInTheRadius(
    pickupCoordinates.ltd,
    pickupCoordinates.lng,
    2
  );

  ride.otp = ""

  // populate ride user
  const rideWithUser = await Ride.findById(ride._id).populate("user");

  // send ride request to captains
  captains?.forEach((captain) => {
    if (captain.socketId) {
      sendMessageToSocketId(captain.socketId, {
        event: "new-ride",
        data: rideWithUser,
      });
    }
  });

  return res
    .status(201)
    .json(new ApiResponse(201, ride, "Ride created successfully"));
});