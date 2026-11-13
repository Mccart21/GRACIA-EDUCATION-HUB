
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'users',
  synchronize: false,
})
export class User {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'number',
  })
  id!: number;

  // Unique username used for login.
  @Column({
    name: 'username',
    type: 'varchar2',
    length: 100,
    unique: true,
  })
  username!: string;

  // Unique email address belonging to the account.
  @Column({
    name: 'email',
    type: 'varchar2',
    length: 100,
    unique: true,
  })
  email!: string;

  // Student education level.
  @Column({
    name: 'level',
    type: 'varchar2',
    length: 50,
    nullable: true,
  })
  level!: string | null;

  // Hashed password. Never return this field to the client.
  @Column({
    name: 'password',
    type: 'varchar2',
    length: 255,
  })
  password!: string;

  // Account role controls portal and API access.
  // Elevated roles must be assigned through an authorized process.
  @Column({
    name: 'role',
    type: 'varchar2',
    length: 20,
    default: 'student',
  })
  role!: 'student' | 'teacher' | 'tutor' | 'admin';

  // Only active accounts can authenticate successfully.
  @Column({
    name: 'accountStatus',
    type: 'varchar2',
    length: 20,
    default: 'active',
  })
  accountStatus!: 'active' | 'pending' | 'suspended';

  // Email verification status: 1 = verified, 0 = not verified.
  @Column({
    name: 'emailVerified',
    type: 'number',
    precision: 1,
    default: 0,
  })
  emailVerified!: number;

  @Column({
    name: 'emailVerificationTokenHash',
    type: 'varchar2',
    length: 64,
    nullable: true,
  })
  emailVerificationTokenHash!: string | null;

  @Column({
    name: 'emailVerificationExpiresAt',
    type: 'timestamp',
    nullable: true,
  })
  emailVerificationExpiresAt!: Date | null;

  // Profile information.
  @Column({
    name: 'profilePicture',
    type: 'varchar2',
    length: 500,
    nullable: true,
  })
  profilePicture!: string | null;

  @Column({
    name: 'dateOfBirth',
    type: 'date',
    nullable: true,
  })
  dateOfBirth!: Date | null;

  @Column({
    name: 'phoneNumber',
    type: 'varchar2',
    length: 30,
    nullable: true,
  })
  phoneNumber!: string | null;

  @Column({
    name: 'alternativePhoneNumber',
    type: 'varchar2',
    length: 30,
    nullable: true,
  })
  alternativePhoneNumber!: string | null;

  @Column({
    name: 'district',
    type: 'varchar2',
    length: 100,
    nullable: true,
  })
  district!: string | null;

  @Column({
    name: 'ta',
    type: 'varchar2',
    length: 100,
    nullable: true,
  })
  ta!: string | null;

  @Column({
    name: 'country',
    type: 'varchar2',
    length: 100,
    nullable: true,
  })
  country!: string | null;

  // Academic results and progress.
  @Column({
    name: 'results',
    type: 'clob',
    nullable: true,
  })
  results!: string | null;

  @Column({
    name: 'progress',
    type: 'clob',
    nullable: true,
  })
  progress!: string | null;

  @Column({
    name: 'nationalIdStatus',
    type: 'varchar2',
    length: 50,
    nullable: true,
  })
  nationalIdStatus!: string | null;

  @CreateDateColumn({
    name: 'createdAt',
    type: 'timestamp',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
    type: 'timestamp',
  })
  updatedAt!: Date;
}
