import { StreamChat } from "stream-chat";
import { STREAM_KEY, STREAM_SECRET_KEY } from "../../constants.js";


const apiKey = STREAM_KEY;
const apiSecret = STREAM_SECRET_KEY;

if(!apiKey || !apiSecret) {
  throw new Error("API key is missing");
}

 const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) =>{
    try {
       await streamClient.upsertUser(userData); 
       return userData;
    } catch (error) {
        console.error("Error upserting Stream user:", error.message);
    }
}

export const getStreamToken = async (userId) => {}