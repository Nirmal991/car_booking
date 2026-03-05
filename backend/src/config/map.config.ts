import axios from "axios";
import { ApiError, asyncHandler } from "../lib";
import { Captain } from "../models";

type PlacePrediction = {
  description: string;
};

type AutoCompleteResponse = {
  status: string;
  predictions: PlacePrediction[];
};

export const getAddressCoordinates = async (address: string) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    const response = await axios.get(url); 

    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;

      return {
        ltd: location.lat,
        lng: location.lng,
      };
    } else {
      throw new Error("Unable to fetch coordinates");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getDistance = async(origin: string, destination: string) =>{
    if(!origin || !destination) {
        throw new Error("Origin and destination are required");
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if(response.data.status === 'OK') {
             if (response.data.rows[ 0 ].elements[ 0 ].status === 'ZERO_RESULTS') {
                throw new Error('No routes found');
            }
            return response.data.rows[ 0 ].elements[ 0 ];
        }else{
            throw new Error('Unable to fetch distance and time');
        } 
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const getAutoCompleteSuggestion = async(input: string) => {
    if (!input) {
        throw new ApiError(400,'query is required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get<AutoCompleteResponse>(url);
        if(response.data.status === 'OK') {
            return response.data.predictions.map(prediction => prediction.description).filter(value => value);
        }else{
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const getCaptainsInTheRadius = async(ltd: number, lng: number, radius: number) => {
    const captains = await Captain.find({
        location: {
            $geoWithin:{
                $centerSphere: [ [ ltd, lng ], radius / 6371 ]
            }
        }
    });
    return captains;
}