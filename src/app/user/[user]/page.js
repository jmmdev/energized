import axios from "axios";
import UserData from "@/components/user-data";

export default async function User({params}) {
    const { user } = await params;

    let userData;
    
    try {
        const response = await axios.get(`${process.env.SERVER_URL}/users/user/${user}`);
        userData = response.data;
    } 
    catch (e) {
        userData = null;
    }
    finally {
        return <UserData data={userData} />
    }
}