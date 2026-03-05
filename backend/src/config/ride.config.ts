import { ApiError } from "../lib";
import { VehicleType } from "../types/vehicle";
import { getDistance } from "./map.config";
import crypto from 'crypto';

export const getFair = async(pickup : string, destination: string): Promise<Record<VehicleType, number>> => {
    if (!pickup || !destination) {
        throw new ApiError(400,'Pickup and destination are required');
    }

    const distance = await getDistance(pickup, destination);

    const baseFair = {
        auto: 30,
        car: 50,
        moto: 20
    }

    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };

    const fair = {
        auto: Math.round(baseFair.auto + ((distance.distance.value / 1000) * perKmRate.auto) + ((distance.duration.value / 60) * perMinuteRate.auto)),
        car: Math.round(baseFair.car + ((distance.distance.value / 1000) * perKmRate.car) + ((distance.duration.value / 60) * perMinuteRate.car)),
        moto: Math.round(baseFair.moto + ((distance.distance.value / 1000) * perKmRate.moto) + ((distance.duration.value / 60) * perMinuteRate.moto)),
    };
    return fair;
}

export function getOTP(num : number) {
    function generateOtp(num: number) {
        const otp = crypto.randomInt(Math.pow(10, num-1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
} 