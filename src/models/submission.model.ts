import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class Submission {
    _id: mongoose.Types.ObjectId;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: mongoose.Types.ObjectId;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Problem' })
    problemId: mongoose.Types.ObjectId;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Contest' })
    contestId: mongoose.Types.ObjectId;

    @Prop({ required: true })
    time: Date;

    @Prop({ required: true })
    verdict: string;

    @Prop({ required: true })
    language: string;

    @Prop({ required: true })
    code: string;
}

export type SubmissionDocument = Submission & mongoose.Document;
export const SubmissionSchema = SchemaFactory.createForClass(Submission);
