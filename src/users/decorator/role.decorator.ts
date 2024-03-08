import { SetMetadata } from "@nestjs/common";
import { RolesTypeEnum } from "../entity/users.entity";

export const ROLES_KEY = 'user_role';

export const Roles = (role: RolesTypeEnum) => SetMetadata(ROLES_KEY, role);

