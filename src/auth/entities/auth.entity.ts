import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema()
export class Auth extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  id: mongoose.Types.ObjectId;

  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);

AuthSchema.pre('save', async function (next) {
  try {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
      next();
    }
  } catch (error) {
    return next(error);
  }
});
AuthSchema.plugin(require('mongoose-unique-validator'), {
  message: 'Error, expected {PATH} to be unique.',
});