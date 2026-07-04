import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateNotionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;
}
