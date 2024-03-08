import { join } from "path";

export const PROJECT_ROOT_PATH = process.cwd();

export const PUBLIC_FOLDER_NAME = 'public';

export const POST_FOLDER_NAME = 'post';

export const PROFILE_FOLDER_NAME = 'profile';

export const TEMP_FOLDER_NAME = 'temp';


//절대경로

export const PUBLIC_FOLDER_PATH = join(
    PROJECT_ROOT_PATH,
    PUBLIC_FOLDER_NAME,
);

export const POST_FOLDER_PATH = join(
    PUBLIC_FOLDER_PATH,
    POST_FOLDER_NAME,
);

export const PROFILE_FOLDER_PATH = join(
    PUBLIC_FOLDER_PATH,
    PROFILE_FOLDER_NAME,
);

export const TEMP_FOLDER_PATH = join(
    PUBLIC_FOLDER_PATH,
    TEMP_FOLDER_NAME,
);


//상대경로

export const PUBLIC_POST_IMAGE_PATH = join(
    PUBLIC_FOLDER_NAME,
    POST_FOLDER_NAME,
);

export const PUBLIC_PROFILE_IMAGE_PATH = join(
    PUBLIC_FOLDER_NAME,
    PROFILE_FOLDER_NAME,
);