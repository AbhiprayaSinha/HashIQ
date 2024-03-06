import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class Tag {
    _id: mongoose.Types.ObjectId;

    @Prop({ required: true, unique: true })
    name: string;
}

export type TagDocument = Tag & Document;
export const TagSchema = SchemaFactory.createForClass(Tag);