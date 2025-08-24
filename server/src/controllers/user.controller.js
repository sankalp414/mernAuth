import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = await User.generateAccessToken()
        const refreshToken = await User.generateRefreshToken()

        user.refreshToken = refreshToken

        return {accessToken,refreshToken}

    } catch (error) {
        throw new apiError(500,"Soomething went wrong while generating access and refresh token")
    }
}


const registerUser = asyncHandler(async(req,res)=>{
    const {fullName,email,username,password} = req.body

    if([fullName,email,username,password].some((fields)=> fields.trim() === "")){
        throw new apiError(400,"All fields are required")
    }
    const existedUser = await User.findOne({
        $or:[{fullName},{email}]
    })
    if(existedUser){
        throw new apiError(400,"User already existed")
    }
    const user = await User.create({
        fullName,
        email,
        username,
        password
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new apiError(400,"User not created successfully")
    }

    return res
    .status(201)
    .json(new apiResponse(200,createdUser,"User created successfully"))

})


const loginUser = asyncHandler(async(req,res)=>{
    const {username,email,password} = req.body
    if(!(username || email)){
        throw new apiError(400,"All fields are required")
    }
    const user = await User.findOne({
        $or:[
            {email},{username}
        ]
    })
    if(!user){
        throw new apiError(404,"User does not exist")
    }
    const isPasswordValid = await User.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new apiError(400,"Entered password is not correct")
    }

    const {accessToken, refreshToken} =  await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    options={
        httponly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",options,accessToken)
    .cookie("refreshToken",options,refreshToken)
    .json(new apiResponse(200,loggedInUser,"User loggedIn successfully"))

})

const logoutUser = asyncHandler(async(req,res)=>{

    await User.findByIdAndUpdate(req.user._id,{
        
        $unset:{
            refreshToken:1
        },
        
    },{new:true})

    const options ={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearcookie("accessToken",options)
    .clearcookie("refreshToken",options)
    .json(new apiResponse(200,{},"User logged out successfully"))
})


const refreshAccessToken = asyncHandler(async(req,res)=>{
    

    

})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}