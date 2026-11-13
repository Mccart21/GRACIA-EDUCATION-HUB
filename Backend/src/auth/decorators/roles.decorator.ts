import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'gracia_allowed_roles';

export type UserRole = 'student' | 'teacher' | 'tutor' | 'admin';

export const Roles = (...roles: UserRole[]) =>
  SetMetadata(ROLES_KEY, roles);
