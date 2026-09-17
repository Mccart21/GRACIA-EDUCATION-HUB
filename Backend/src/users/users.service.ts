import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EducationLevel } from 'src/common/enums';

export type UserLevel =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'skills';

export type UserRole =
  | 'student'
  | 'teacher'
  | 'tutor'
  | 'admin';

export interface GraciaUser {
  id: number;
  name: string;
  email: string;
  password: string;
  level?: EducationLevel;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
}

@Injectable()
export class UsersService {
  private users: GraciaUser[] = [];
  private nextId = 1;

  async create(data: {
    name: string;
    email: string;
    password: string;
    level?: EducationLevel;
    role?: UserRole;
    phone?: string;
  }) {
    const existing = this.users.find(
      (user) =>
        user.email.toLowerCase() === data.email.toLowerCase(),
    );

    if (existing) {
      throw new ConflictException(
        'An account with this email already exists.',
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user: GraciaUser = {
      id: this.nextId++,
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      level: data.level,
      role: data.role || 'student',
      phone: data.phone,
      isActive: true,
      createdAt: new Date(),
    };

    this.users.push(user);

    return this.sanitize(user);
  }

  async findByEmail(email: string) {
    return this.users.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async findOne(id: number) {
    const user = this.users.find((item) => item.id === id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return this.sanitize(user);
  }

  async findAll() {
    return this.users.map((user) => this.sanitize(user));
  }

  async update(
    id: number,
    data: Partial<{
      name: string;
      phone: string;
      level: EducationLevel;
      role: UserRole;
      isActive: boolean;
    }>,
  ) {
    const user = this.users.find((item) => item.id === id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    Object.assign(user, data);

    return this.sanitize(user);
  }

  private sanitize(user: GraciaUser) {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}