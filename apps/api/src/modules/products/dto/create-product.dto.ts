import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
