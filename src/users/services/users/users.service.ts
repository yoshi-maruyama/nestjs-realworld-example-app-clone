import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { Profile } from 'src/typeorm/entities/Profile';
import { User } from 'src/typeorm/entities/User';
import {
  CreateUserParams,
  CreateUSerProfileParams,
  UpdateUserParams,
} from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userReopsitory: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  findUsers() {
    return this.userReopsitory.find();
  }

  createUser(userDetails: CreateUserParams) {
    const newUser = this.userReopsitory.create({
      ...userDetails,
      createdAt: new Date(),
    });
    return this.userReopsitory.save(newUser);
  }

  updateUser(id: number, updateUserDetails: UpdateUserParams) {
    return this.userReopsitory.update({ id }, { ...updateUserDetails });
  }

  deleteUser(id: number) {
    return this.userReopsitory.delete({ id });
  }

  async createUserProfile(
    id: number,
    createUserProfileDetails: CreateUSerProfileParams,
  ) {
    const user = await this.userReopsitory.findOneBy({ id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const newProfile = this.profileRepository.create(createUserProfileDetails);
    const savedProfile = await this.profileRepository.save(newProfile);
    user.profile = savedProfile;
    return this.userReopsitory.save(user);
  }
}
