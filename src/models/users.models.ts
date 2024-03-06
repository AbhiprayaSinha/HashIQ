import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class User {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  firstname: string;

  @Prop()
  lastname: string;

  @Prop({ default: null })
  password: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }]})
  devices: mongoose.Types.ObjectId[];

  @Prop()
  profilePic: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone: string;

  @Prop()
  githubUsername: string;

  @Prop()
  about: string;

  @Prop()
  organization: string;

  @Prop()
  country: string;

  @Prop()
  skills: string[];

  @Prop({ default: false })
  isAdmin: boolean;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
