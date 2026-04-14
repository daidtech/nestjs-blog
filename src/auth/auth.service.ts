import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAuthRegisterDto } from "./dto/create-auth-register.dto";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(dto: CreateAuthRegisterDto) {
    const { email, firstName, lastName, password, confirmPassword } = dto;

    if (!email || !password || !confirmPassword) {
      throw new BadRequestException('Missing required fields');
    }
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check for existing user
    const existing = await this.prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    });
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    // Hash password (replace with real hash in production)
    // const hashed = await bcrypt.hash(password, 10);
    const hashed = password; // TODO: Use bcrypt

    const user = await this.prisma.user.create({
      data: {
        email: email.toLowerCase(),
        firstName,
        lastName,
        isActive: true,
        // avatarUrl, phoneNumber, etc. can be added here
        password: hashed, // Uncomment if you add password field to User model
      },
    });

    // Return user info (omit password)
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
    };
  }
}