CREATE TABLE "favorities" (
	"id" serial PRIMARY KEY NOT NULL,
	"userID" text NOT NULL,
	"recipeID" integer NOT NULL,
	"title" text NOT NULL,
	"image" text,
	"cookTime" integer NOT NULL,
	"servings" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
