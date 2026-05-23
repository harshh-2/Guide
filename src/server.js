import express from "express";
import {ENV} from "./config/env.js";
import {db} from "./config/db.js";
import {and,eq} from "drizzle-orm";
import {favorites} from "./db/schema.js";

const app=express();
const PORT=ENV.PORT;

app.use(express.json());

app.post("/api/favorites",async (req,res)=>{
    try{
    const {userID,recipeID,title,image,cookTime,servings}=req.body;
    if(!userID || !recipeID || !title){
        return res.status(400).json({error:"Missing required fields"});
    }
    const newfavorite= await db.insert(favorites).values({
        userID,
        recipeID,
        title,
        image,
        cookTime,
        servings,
    }).returning();
    res.status(201).json(newfavorite[0]);
    }
    catch(error){
      console.error("Error adding to favorites:",error);
      res.status(500).json({error:"Failed to add to favorites"});
    }
});

app.get("/api/favorites/:userID",async(req,res)=>{
    try{
        const {userID}=req.params;
        const userFavorites= await db.select().from(favorites).where(eq(favorites.userID,userID));
        res.status(200).json(userFavorites);
    }
    catch(error){
        console.error("Error fetching favorites:",error);
        res.status(500).json({error:"Failed to fetch favorites"});
    }
});

app.delete("/api/favorites/:userID/:recipeID",async (req,res)=>{
    try{
        const {userID,recipeID}=req.params;
        const deletedFavorite= await db.delete(favorites).where(
            and(eq(favorites.userID,userID),eq(favorites.recipeID,parseInt(recipeID)))
        ).returning();
        if(deletedFavorite.length===0){
            return res.status(404).json({error:"Favorite not found"});
        }
        res.status(200).json({message:"Favorite deleted successfully"});
    }
    catch(error){
        console.error("Error deleting from favorites:",error);
        res.status(500).json({error:"Failed to delete from favorites"});
    }
});

app.get("/api/health",(req,res)=>{
        res.status(200).json({
        status:"Running"});
});

app.listen(PORT,()=>{
console.log(`Server is running on port ${PORT}`);
});
