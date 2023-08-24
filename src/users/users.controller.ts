import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-users.dto';
import ResponsePresenter from 'src/presenters/response.presenter';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from 'src/auth/guards/auth/auth.guard';
import * as moment from 'moment';
import { UpdateUsersDto } from './dto/update-users.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller()
export class UsersController extends ResponsePresenter {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {
    super();
  }

  @Post('createProfile')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      dest: './uploads',
      storage: diskStorage({
        destination: './uploads',
        filename(req, file, callback) {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `${randomName}${file.originalname}`);
        },
      }),
    }),
  )
  async createProfile(
    @Body() body: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: 'image',
          }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Req() req,
  ) {
    try {
      body.image_profile = image.path;
      body.auth_id = req.user.sub;

      const time = moment(body.birthday).format('MM-DD');
      const [month, day] = time.split('-');
      const getZodiacSign = this.usersService.getZodiacSign(+month, +day);
      if (!getZodiacSign)
        return this.error('Invalid date', HttpStatus.BAD_REQUEST);

      if (getZodiacSign instanceof Object) {
        body.horoscope = getZodiacSign.horoscope;
        body.zodiac = getZodiacSign.zodiac;
      }

      const user = await this.usersService.createUser(body);
      return this.success(user, 'User created', HttpStatus.CREATED);
    } catch (error) {
      return this.error(error.message, error.status);
    }
  }

  @Get('getProfile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async getProfile(@Req() req) {
    try {
      const user = await this.usersService.findOne(req.user.sub);
      return this.success(user, 'User found', HttpStatus.OK);
    } catch (error) {
      return this.error(error.message, error.status);
    }
  }

  @Patch('updateProfile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      dest: './uploads',
      storage: diskStorage({
        destination: './uploads',
        filename(req, file, callback) {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `${randomName}${file.originalname}`);
        },
      }),
    }),
  )
  async updateProfile(
    @Req() req,
    @Body() body: UpdateUsersDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new FileTypeValidator({
            fileType: 'image',
          }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    try {
      if (image) {
        body.image_profile = image.path;
      }
      const user = await this.usersService.findOneAndUpdate(req.user.sub, body);

      if (body.birthday) {
        const time = moment(body.birthday).format('MM-DD');
        const [month, day] = time.split('-');
        const getZodiacSign = this.usersService.getZodiacSign(+month, +day);
        if (!getZodiacSign)
          return this.error('Invalid date', HttpStatus.BAD_REQUEST);

        if (getZodiacSign instanceof Object) {
          body.horoscope = getZodiacSign.horoscope;
          body.zodiac = getZodiacSign.zodiac;
        }
      }
      return this.success(user, 'User found', HttpStatus.OK);
    } catch (error) {
      return this.error(error.message, error.status);
    }
  }
}
