import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBankDetailDto {
    @IsString()
    @IsNotEmpty()
    bankName!: string;

    @IsString()
    @IsNotEmpty()
    accountName!: string;

    @IsString()
    @IsNotEmpty()
    accountNumber!: string;

    @IsString()
    @IsNotEmpty()
    branch!: string;
}
