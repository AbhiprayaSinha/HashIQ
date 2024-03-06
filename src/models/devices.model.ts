import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
import { IBrowser, ICPU, IDevice, IEngine, IOS } from 'ua-parser-js';

@Schema({ timestamps: true })
export class Device {
    _id: mongoose.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    userId: string;

    // @Prop({ required: true })
    // deviceId: string;

    @Prop({ type: {} as IBrowser, required: true })
    browser: IBrowser

    @Prop({ type: {} as IEngine, required: true })
    engine: IEngine

    @Prop({ type: {} as IOS, required: true })
    os: IOS

    @Prop({ type: {} as IDevice, required: true })
    device: IDevice

    @Prop({ type: {} as ICPU, required: true })
    cpu: ICPU

    @Prop({ required: true })
    ipAddress: string;

    @Prop({default: "Unknown"})
    location: string;
}

export type DeviceDocument = Device & Document;
export const DeviceSchema = SchemaFactory.createForClass(Device);
