import { PickType } from "@nestjs/mapped-types";
import { BanModel } from "../entity/ban.entity";

export class CreateBanDto extends PickType(BanModel, ['banUserId', 'reason']) { }