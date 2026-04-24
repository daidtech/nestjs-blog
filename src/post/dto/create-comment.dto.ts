import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MaxLength(1000)
  content!: string;

  @IsOptional()
  @IsInt()
  parentId?: number | null;
}
