import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class UserResult {
    _id: mongoose.Types.ObjectId;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: mongoose.Types.ObjectId;

    @Prop({require: true})
    totalPoints: number;
    
    @Prop({require: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }]})
    submissions: mongoose.Types.ObjectId[];

}