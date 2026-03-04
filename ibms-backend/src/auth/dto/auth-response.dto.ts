import { UserResponseDto } from './user-response.dto.js';

export class AuthResponseDto {
  accessToken: string;
  user: UserResponseDto;
}
