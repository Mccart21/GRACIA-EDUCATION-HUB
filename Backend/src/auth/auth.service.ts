
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomInt } from 'crypto';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { PendingRegistration } from '../pending-registrations/pending-registration.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly verificationExpiryMs = 30 * 60 * 1000;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(PendingRegistration)
    private readonly pendingRepository: Repository<PendingRegistration>,

    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
    private readonly emailService: EmailService,
  ) {}

  // Generate a six-digit email verification code.
  private createVerificationCode(): string {
    return randomInt(0, 1_000_000).toString().padStart(6, '0');
  }

  // Store a hash of the verification code, not the original code.
  private hashVerificationCode(code: string): string {
    return createHash('sha256').update(code).digest('hex');
  }

  // Send the verification code to the pending registrant.
  private async sendCode(
    pending: PendingRegistration,
    code: string,
  ): Promise<void> {
    await this.emailService.sendVerificationCode(
      pending.email,
      pending.username,
      code,
    );
  }

  // Register a public student account.
  async register(registerDto: RegisterDto) {
    const username = registerDto.username?.trim();
    const email = registerDto.email?.trim().toLowerCase();
    const level = registerDto.level?.trim();
    const { password, confirmPassword } = registerDto;

    if (!username || !email || !level) {
      throw new BadRequestException(
        'Username, email, and education level are required.',
      );
    }

    if (username.length > 100 || email.length > 100) {
      throw new BadRequestException(
        'Username and email must each be no longer than 100 characters.',
      );
    }

    if (level.length > 30) {
      throw new BadRequestException(
        'Education level must be no longer than 30 characters.',
      );
    }

    if (password !== confirmPassword) {
      throw new ConflictException('Passwords do not match.');
    }

    if (typeof password !== 'string' || password.length === 0) {
      throw new BadRequestException('Password is required.');
    }

    // Reject emails that already have permanent accounts.
    const existingEmail = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingEmail) {
      throw new ConflictException(
        'This email is already registered. Please log in instead.',
      );
    }

    // Reject usernames belonging to permanent accounts.
    const existingUsername = await this.usersRepository.findOne({
      where: { username },
    });

    if (existingUsername) {
      throw new ConflictException('Username already exists.');
    }

    // Look for an earlier unverified registration.
    const pendingByEmail = await this.pendingRepository.findOne({
      where: { email },
    });

    const pendingByUsername = await this.pendingRepository.findOne({
      where: { username },
    });

    if (
      pendingByUsername &&
      pendingByUsername.id !== pendingByEmail?.id
    ) {
      throw new ConflictException(
        'That username is already being used for another pending registration.',
      );
    }

    // Hash the password before temporarily storing it.
    const hashedPassword = await bcrypt.hash(password, 10);
    const code = this.createVerificationCode();

    const pending =
      pendingByEmail ?? this.pendingRepository.create();

    pending.username = username;
    pending.email = email;
    pending.level = level;
    pending.password = hashedPassword;
    pending.verificationCodeHash =
      this.hashVerificationCode(code);
    pending.verificationExpiresAt = new Date(
      Date.now() + this.verificationExpiryMs,
    );

    // Registration writes only to PENDING_REGISTRATIONS.
    const savedPending = await this.pendingRepository.save(pending);

    try {
      await this.sendCode(savedPending, code);

      return {
        message:
          'Registration received. Check your email for your six-digit verification code.',
        emailSent: true,
        email: savedPending.email,
      };
    } catch (error) {
      this.logger.error(
        'Could not send the verification code for a pending registration.',
        error instanceof Error ? error.stack : String(error),
      );

      return {
        message:
          'Your registration is pending, but the email could not be sent. Request a new code to try again.',
        emailSent: false,
        email: savedPending.email,
      };
    }
  }

  // Complete registration after successful email verification.
  async verifyEmail(code: string) {
    const normalizedCode = code?.trim();

    if (!normalizedCode || !/^\d{6}$/.test(normalizedCode)) {
      throw new BadRequestException(
        'Enter a valid six-digit verification code.',
      );
    }

    const codeHash = this.hashVerificationCode(normalizedCode);

    const pending = await this.pendingRepository.findOne({
      where: { verificationCodeHash: codeHash },
    });

    if (
      !pending ||
      !pending.verificationExpiresAt ||
      pending.verificationExpiresAt.getTime() <= Date.now()
    ) {
      throw new BadRequestException(
        'The verification code is invalid or has expired. Request a new code.',
      );
    }

    // Check for conflicting permanent accounts.
    const existingEmail = await this.usersRepository.findOne({
      where: { email: pending.email },
    });

    if (existingEmail) {
      await this.pendingRepository.delete(pending.id);

      throw new ConflictException(
        'This email is already registered. Please log in instead.',
      );
    }

    const existingUsername = await this.usersRepository.findOne({
      where: { username: pending.username },
    });

    if (existingUsername) {
      await this.pendingRepository.delete(pending.id);

      throw new ConflictException(
        'This username is already in use. Please register with another username.',
      );
    }

    // Public email verification can create a student account only.
    // Educator and administrator roles require a separate authorized process.
    const user = this.usersRepository.create({
      username: pending.username,
      email: pending.email,
      level: pending.level,
      password: pending.password,
      role: 'student',
      accountStatus: 'active',
      emailVerified: 1,
      emailVerificationTokenHash: null,
      emailVerificationExpiresAt: null,
    });

    const savedUser = await this.usersRepository.save(user);

    // Preserve the existing profile-completion notification.
    try {
      await this.notificationsService.create(
        savedUser.id,
        'Complete your student profile',
        'Welcome to Gracia Education Hub! Please complete your student profile so we can keep your learning information up to date.',
        'profile',
        '/dashboard',
      );
    } catch (error) {
      this.logger.error(
        `Account ${savedUser.id} was created, but the profile reminder could not be saved.`,
        error instanceof Error ? error.stack : String(error),
      );
    }

    // Remove the temporary registration after the user is saved.
    await this.pendingRepository.delete(pending.id);

    return {
      message: 'Email verified successfully. You can now log in.',
    };
  }

  // Resend a verification code without revealing account existence.
  async resendVerificationEmail(email: string) {
    const normalizedEmail = email?.trim().toLowerCase();

    if (normalizedEmail) {
      const pending = await this.pendingRepository.findOne({
        where: { email: normalizedEmail },
      });

      if (pending) {
        const code = this.createVerificationCode();

        pending.verificationCodeHash =
          this.hashVerificationCode(code);

        pending.verificationExpiresAt = new Date(
          Date.now() + this.verificationExpiryMs,
        );

        await this.pendingRepository.save(pending);

        try {
          await this.sendCode(pending, code);
        } catch (error) {
          this.logger.error(
            'Unable to resend a pending registration verification code.',
            error instanceof Error ? error.stack : String(error),
          );
        }
      }
    }

    return {
      message:
        'If a pending registration exists for that email, a verification code will be sent.',
    };
  }

  // Authenticate a user with their email/username and password.
  async login(identifier: string, password: string) {
    const normalizedIdentifier = identifier?.trim();

    if (
      !normalizedIdentifier ||
      typeof password !== 'string' ||
      password.length === 0
    ) {
      throw new UnauthorizedException(
        'Invalid username/email or password.',
      );
    }

    const user = await this.usersRepository.findOne({
      where: [
        { email: normalizedIdentifier.toLowerCase() },
        { username: normalizedIdentifier },
      ],
    });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid username/email or password.',
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException(
        'Invalid username/email or password.',
      );
    }

    // Refuse login for suspended or pending accounts.
    if (user.accountStatus !== 'active') {
      throw new UnauthorizedException(
        'This account is not active. Contact the administrator.',
      );
    }

    if (Number(user.emailVerified) !== 1) {
      throw new UnauthorizedException(
        'Please verify your email before logging in.',
      );
    }

    // Role is included in the token for identity context.
    // Protected requests must still reload the current role from Oracle.
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const { password: _password, ...safeUser } = user;

    return {
      message: 'Login successful',
      accessToken,
      user: safeUser,
    };
  }
}
