import { IsIP, IsOptional, IsString } from 'class-validator';

export class CreateWhitelistEntryDto {
  @IsIP()
  ip: string;

  @IsString()
  @IsOptional()
  label?: string;
}
