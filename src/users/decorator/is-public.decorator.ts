import { SetMetadata } from "@nestjs/common";

export const PUBLIC_KEY = 'user_public';

export const IsPublic = () => SetMetadata(PUBLIC_KEY, true);