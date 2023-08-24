import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

@Schema()
export class User extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  id: mongoose.Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ type: String, enum: Object.values(Gender) })
  gender: Gender;
  @Prop()
  birthday: Date;

  @Prop()
  horoscope: string;

  @Prop()
  zodiac: string;

  @Prop()
  weight: number;

  @Prop()
  height: number;

  @Prop()
  image_profile: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
