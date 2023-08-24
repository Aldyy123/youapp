import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from './entities/auth.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private readonly authModel: Model<Auth>,
    private jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const user = new this.authModel(createAuthDto);
    return user.save();
  }

  async signIn(data: SignInDto) {
    const user = await this.authModel
      .findOne({
        $or: [{ email: data.email }, { username: data.username }],
      })
      .select('+password');
    return user;
  }

  async signInToken(user: any) {
    const payload = {
      email: user.email,
      username: user.username,
      sub: user._id,
    };
    return {
      access_token: await this.jwtService.sign(payload, {
        privateKey: process.env.JWT_SECRET,
      }),
    };
  }

  findOneAndUpdate(id: string, updateAuthDto: UpdateAuthDto) {
    return this.authModel.findOneAndUpdate({ id }, updateAuthDto);
  }

  async remove(email: string) {
    return this.authModel.deleteOne({ email });
  }
}
