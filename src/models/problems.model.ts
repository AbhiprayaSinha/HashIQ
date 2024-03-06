import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";


@Schema()
export class Problem {
    _id: mongoose.Types.ObjectId;

    @Prop({ required: true, unique: true })
    title: string;

    @Prop({ required: true })
    serialNumber: number

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }]})
    tags: mongoose.Types.ObjectId[];

    @Prop({ required: true })
    description: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }]})
    topic: mongoose.Types.ObjectId[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }]})
    companies: mongoose.Types.ObjectId[];

    @Prop({ required: true })
    difficulty: number;

    @Prop({ required: true, default: [] })
    sampleInput: string[];

    @Prop({ required: true, default: [] })
    sampleOutput: string[];

    @Prop({ required: true, default: [] })
    hiddenInput: string[];

    @Prop({ required: true, default: [] })
    hiddenOutput: string[];

    @Prop({ required: true, default: 0 })
    acceptedSubmissions: number;

    @Prop({ required: true, default: 0 })
    totalSubmissions: number;

    @Prop()
    editorial: string;

    @Prop({ required: true })
    constraints: string;

    @Prop({ required: true, default: 1 })
    timeLimit: number;

    @Prop({ required: true, default: 128 })
    memoryLimit: number;

}


export const ProblemSchema = SchemaFactory.createForClass(Problem);
export type ProblemDocument = Problem & mongoose.Document;

ProblemSchema.index({ title: 'text' });