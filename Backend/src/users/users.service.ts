import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);

    const savedUser = await this.usersRepository.save(user);
    const { password: _, ...safeUser } = savedUser;

    return safeUser;
  }

  async findAll() {
    return this.usersRepository.find({
      select: {
        id: true,
        username: true,
        email: true,
        level: true,
        profilePicture: true,
        dateOfBirth: true,
        phoneNumber: true,
        alternativePhoneNumber: true,
        district: true,
        ta: true,
        country: true,
        results: true,
        progress: true,
        nationalIdStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        level: true,
        profilePicture: true,
        dateOfBirth: true,
        phoneNumber: true,
        alternativePhoneNumber: true,
        district: true,
        ta: true,
        country: true,
        results: true,
        progress: true,
        nationalIdStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);

    const savedUser = await this.usersRepository.save(user);
    const { password: _, ...safeUser } = savedUser;

    return safeUser;
  }

  async updateProfile(
    id: number,
    updateProfileDto: UpdateProfileDto,
  ) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Sensitive fields can be saved once.
    // After the first value is saved, changes require support.
    const lockedFields = [
      'dateOfBirth',
      'district',
      'ta',
      'country',
      'nationalIdStatus',
    ] as const;

    for (const field of lockedFields) {
      const currentValue = user[field];
      const incomingValue = updateProfileDto[field];

      if (
        currentValue !== null &&
        currentValue !== undefined &&
        incomingValue !== undefined &&
        String(currentValue) !== String(incomingValue)
      ) {
        throw new BadRequestException(
          `${field} has already been saved and cannot be changed. Please contact support for corrections.`,
        );
      }
    }

    // Results and progress must be managed by the academic system.
    if (
      updateProfileDto.results !== undefined ||
      updateProfileDto.progress !== undefined
    ) {
      throw new BadRequestException(
        'Results and progress cannot be changed through the profile endpoint.',
      );
    }

    // Check that the phone number is not already in use.
    if (
      updateProfileDto.phoneNumber &&
      updateProfileDto.phoneNumber !== user.phoneNumber
    ) {
      const existingPhone = await this.usersRepository.findOne({
        where: {
          phoneNumber: updateProfileDto.phoneNumber,
        },
      });

      if (existingPhone && existingPhone.id !== id) {
        throw new ConflictException(
          'Phone number is already in use',
        );
      }
    }

    // Check the alternative phone number too.
    if (
      updateProfileDto.alternativePhoneNumber &&
      updateProfileDto.alternativePhoneNumber !==
        user.alternativePhoneNumber
    ) {
      const existingPhone = await this.usersRepository.findOne({
        where: {
          phoneNumber: updateProfileDto.alternativePhoneNumber,
        },
      });

      if (existingPhone && existingPhone.id !== id) {
        throw new ConflictException(
          'Alternative phone number is already in use',
        );
      }
    }

    // Never accept username or email from this profile DTO.
    // The DTO should not expose either field.
    Object.assign(user, updateProfileDto);

    if (updateProfileDto.dateOfBirth) {
      user.dateOfBirth = new Date(updateProfileDto.dateOfBirth);
    }

    const savedUser = await this.usersRepository.save(user);
    const { password: _, ...safeUser } = savedUser;

    return {
      message: 'Profile updated successfully',
      user: safeUser,
    };
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.delete(id);

    return {
      message: 'User deleted successfully',
    };
  }
}