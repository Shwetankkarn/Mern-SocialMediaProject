import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const connectToDB = async ()=>{
    try{
        const connectioninstance = await mongoose.connect(
            `${process.env.DB_URI}`,
        );
        console.log(`\n Mongodv connnection successful!! DB Host: ${connectioninstance.connection.host} `);
    } catch (error) {
        console.error("Mongodb Connection Error: ", error);
        process.exit(1);
    }
    
};

export default connectToDB;