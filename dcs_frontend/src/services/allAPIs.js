import { serverURL } from "./serverURL";
import commonAPI from "./commonAPI";

// Function to call API endpoints
//1 Register User 
export const registerUserAPI = async(reqBody)=>{
    return await commonAPI('POST',`${serverURL}/api/register`,reqBody,{})
}


//2 Login User
export const loginUserAPI = async(reqBody)=>{
    return await commonAPI('POST',`${serverURL}/api/login`,reqBody,{})
}
//2 Google Login User
export const googleLoginUserAPI = async(reqBody)=>{
    return await commonAPI('POST',`${serverURL}/api/google-login`,reqBody,{})
}


//3 Add Decision API
export const addDecisionAPI = async(reqBody,reqHeader)=>{
    return await commonAPI('POST',`${serverURL}/api/add_decision`,reqBody,reqHeader)
}

export const getLatestDecisionAPI = async (reqHeader) => {
    return await commonAPI('GET',`${serverURL}/api/get_latest_decision`,{},reqHeader)
}