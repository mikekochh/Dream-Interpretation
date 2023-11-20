import mongoose, { Schema, models } from "mongoose";

const activationToken = new Schema({
    
});

const Character = models.Character || mongoose.model("Character", characterSchema);

export default Character;