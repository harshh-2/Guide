import {pgTable,serial,text,timestamp,integer} from "drizzle-orm/pg-core";

export const favorites = pgTable("favorites",
    {id: serial("id").primaryKey(),
     userID: text("userID").notNull(),
     recipeID: integer("recipeID").notNull(),
     title: text("title").notNull(),
     image: text("image"),
     cookTime: integer("cookTime"),
     servings: integer("servings"),
     createdAt: timestamp("createdAt").defaultNow().notNull()
    });