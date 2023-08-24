import { Gender } from '../entities/user.entity';

export class UpdateAuthUsersDto {
  name?: string;

  gender?: Gender;

  birthday?: Date;

  weight?: number;

  height?: number;

  password?: string;

  email?: string;

  username?: string;

  horoscope?: string;

  zodiac?: string;

  image_profile?: string;
}
