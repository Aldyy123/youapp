import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-users.dto';
import { IZodiac } from 'src/constants/constants';
import { UpdateUsersDto } from './dto/update-users.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(user: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findOne(id: string): Promise<User> {
    const user = this.userModel
      .findOne({ auth_id: id })
      .populate('auth_id')
      .exec();
    return user;
  }

  async findOneAndUpdate(auth_id: string, data: UpdateUsersDto) {
    return this.userModel.findOneAndUpdate({ auth_id }, { ...data });
  }

  getZodiacSign(month: number, day: number): IZodiac | boolean {
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
      return {
        horoscope: 'Aries',
        zodiac: 'Ram',
      };
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
      return {
        horoscope: 'Taurus',
        zodiac: 'Bull',
      };
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) {
      return {
        horoscope: 'Gemini',
        zodiac: 'Twins',
      };
    } else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
      return {
        horoscope: 'Cancer',
        zodiac: 'Crab',
      };
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
      return {
        horoscope: 'Leo',
        zodiac: 'Lion',
      };
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
      return {
        horoscope: 'Virgo',
        zodiac: 'Virgin',
      };
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) {
      return {
        horoscope: 'Libra',
        zodiac: 'Balance',
      };
    } else if ((month === 10 && day >= 24) || (month === 11 && day <= 21)) {
      return {
        horoscope: 'Scorpio',
        zodiac: 'Scorpion',
      };
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
      return {
        horoscope: 'Sagittarius',
        zodiac: 'Archer',
      };
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
      return {
        horoscope: 'Capricorn',
        zodiac: 'Goat',
      };
    } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
      return {
        horoscope: 'Aquarius',
        zodiac: 'Water Bearer',
      };
    } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
      return {
        horoscope: 'Pisces',
        zodiac: 'Fish',
      };
    }

    return false;
  }
}
