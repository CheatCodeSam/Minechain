/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../../user/user.entity';
import { UserService } from '../../user/user.service';

@Injectable()
export class UserSerializer extends PassportSerializer {
  constructor(private readonly usersService: UserService) {
    super();
  }

  serializeUser(user: User, done: Function) {
    done(null, user.id);
  }

  deserializeUser(id: string, done: Function) {
    const user = this.usersService.findOne({ id: parseInt(id) });

    if (!user)
      return done(
        `Could not deserialize user: user with id ${id} could not be found`,
        null
      );

    done(null, user);
  }
}
