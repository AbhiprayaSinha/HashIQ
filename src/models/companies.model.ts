import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class Company {
    _id: mongoose.Types.ObjectId;

    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }]})
    problemsAsked: mongoose.Types.ObjectId[];
}

export type CompanyDocument = Company & Document;
export const CompanySchema = SchemaFactory.createForClass(Company);