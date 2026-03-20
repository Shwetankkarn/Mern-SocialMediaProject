import app from "./app.js";
import dotenv from "dotenv";
import connectToDB from "./config/db.js";
dotenv.config({
    path: "./.env",
});

const port = process.env.PORT || 4001;

connectToDB()
.then(()=>{
    const server= app.listen(port, ()=>{
        console.log(`Server running on port ${port}`);
    });
    server.on("error", (error)=>{
        console.error("Server Error: ", error);
        process.exit(1);
    });
})

.catch((error)=>{
console.log(`Mongodb connected failed: `, error);
});

