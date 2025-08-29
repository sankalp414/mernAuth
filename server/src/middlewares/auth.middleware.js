import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"

export const verifyJWT =  async (req,res,next) => {

    try {
        const decodedToken = req.query?.refreshToken || req.headers("Authorization").replace("Bearer","")
        if(!decodedToken){
            throw new apiError(404,"Access token is expired or is used somewhere else")
        }

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user){
            throw new apiError(400,"Invalid access token")
        }

        req.user = user 
        next()

    } catch (error) {
        throw new apiError(401,"Some error occured while generate access and refresh token")
    }
    
}