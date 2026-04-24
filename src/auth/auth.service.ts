import { Injectable, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAuthRegisterDto } from "./dto/create-auth-register.dto";
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private buildAuthUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      username: user.email.split('@')[0],
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      role: 'USER' as const,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

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

    const hashed = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: email.toLowerCase(),
        firstName,
        lastName,
        isActive: true,
        // avatarUrl, phoneNumber, etc. can be added here
        passwordHash: hashed,
      },
    });

    // Return user info (omit password)
    return this.buildAuthUser(user);
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Missing required fields');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const access_token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      access_token,
    };
  }

  getProfile(user: User) {
    return this.buildAuthUser(user);
  }
}