import { ApiProperty } from '@nestjs/swagger'
import { Role } from '@bizmanager/shared-types'

export class AuthUserDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  email: string

  @ApiProperty()
  name: string

  @ApiProperty({ enum: Role })
  role: Role
}

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string

  @ApiProperty()
  user: AuthUserDto
}
