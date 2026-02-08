import { baseURL } from "@/store/baseURL"
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"

export async function login(email :string , password : string){
    try{
       
        const res =await axios.post(`${baseURL.nihal}/user/login` , {email , password})
        if(res.status ==200&& res.data){  
          console.log(res.data)
            // AsyncStorage.setItem("token" , res.data.token)
            return res.data
        }
        return null
    }
    catch(err){
        console.warn(err)
        return null
    }
}

export async function signUpUser(email :string , password : string){
    try{
        
        const res =await axios.post(`${baseURL.nihal}/user/signup` , {email , password})
        if(res.status ==200){
           console.warn("ch",res.data)
            // AsyncStorage.setItem("token" , res.data.token)
            return res.data
        }
        return null
    }
    catch(err){
        console.warn(err)
        return null
    }
}

export async function updateUser(id: string, data: any) {
  try {
    const res = await axios.post(
      `${baseURL.nihal}/user/update`,
      {
        userId: id,
        data,
      }
    );

    if (res.status === 200 && res.data?.user) {
      return res.data.user; // ✅ ALWAYS return user
    }

    return null; // ❌ no numbers
  } catch (err) {
    console.warn("Error", err);
    return null;
  }
}
