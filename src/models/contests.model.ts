import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class Contest {
    _id: mongoose.Types.ObjectId;

    @Prop({ required: true, unique: true })
    contestTitle: string;

    @Prop({ required: true })
    startTime: Date;

    @Prop({ required: true })
    endTime: Date;

    @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] })
    creators: mongoose.Types.ObjectId[];

    @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] })
    participants: mongoose.Types.ObjectId[];

    @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }] })
    contestProblems: mongoose.Types.ObjectId[];

    // standings
    @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserResult' }], default: [] })
    standings: mongoose.Types.ObjectId[];

}

export type ContestDocument = Contest & mongoose.Document;
export const ContestSchema = SchemaFactory.createForClass(Contest);
    