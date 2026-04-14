# NestJS Blog - Step-by-Step Practice Guide

## Current Project Status

### Prisma Schema (5 models)

| Model | Fields | Status |
|-------|--------|--------|
| **User** | id, email, password, firstName, lastName, bio, avatarUrl, phoneNumber, dateOfBirth, isActive, timestamps | Schema only - no CRUD API |
| **Post** | id, title, slug, excerpt, content, published, authorId, timestamps | CRUD implemented (basic) |
| **Category** | id, name, slug, timestamps | Schema only - no CRUD API |
| **Tag** | id, name, slug, timestamps | Schema only - no CRUD API |
| **Tagging** | postId, tagId, assignedAt (composite PK) | Schema only - no API |

### What's Already Built

- Post CRUD (create, read, update, delete)
- Prisma service + module
- Logger middleware
- Global validation pipe (class-validator)
- Next.js frontend (basic posts list, create, detail pages)
- Docker Compose (PostgreSQL + App)

### What's Missing (Features to Build)

- User CRUD + profile management
- Category CRUD
- Tag CRUD
- Post-Tag relationship management
- Post-Category relationship management
- Authentication (JWT)
- Authorization (Guards, Roles)
- Pagination, filtering, sorting
- Search
- File upload (avatar, post images)
- Comments system
- Like/Bookmark system
- Error handling (exceptions, filters)
- API documentation (Swagger)
- Testing (unit + e2e)
- Caching
- Rate limiting
- Logging (advanced)

---

## Phase 1: Core CRUD Modules (NestJS Fundamentals)

> **Goal**: Learn modules, controllers, services, DTOs, and Prisma queries

---

### Step 1.1 - User Module (CRUD)

**You will learn**: Module/Controller/Service pattern, DTOs, validation decorators

**Tasks**:

1. Generate the module:
   ```bash
   nest g module user
   nest g controller user
   nest g service user
   ```

2. Create DTOs:
   - `src/user/dto/create-user.dto.ts`
     ```
     Fields: email (required, @IsEmail), password (required, @IsString, @MinLength(3)),
     firstName?, lastName?, bio?, phoneNumber?, dateOfBirth?
     ```
   - `src/user/dto/update-user.dto.ts` (use `PartialType(CreateUserDto)`)

3. Implement `UserService`:
   - `findAll()` - list all users
   - `findOne(id)` - get user by id (include posts)
   - `create(dto)` - create user (handle unique email/username conflict)
   - `update(id, dto)` - update user
   - `remove(id)` - delete user

4. Implement `UserController`:
   - `GET /users`
   - `GET /users/:id`
   - `POST /users`
   - `PATCH /users/:id`
   - `DELETE /users/:id`

5. Register `UserModule` in `AppModule` imports

**Key NestJS concepts to practice**:
- `@Module()`, `@Controller()`, `@Injectable()`
- `@Body()`, `@Param()`, `ParseIntPipe`
- `@IsEmail()`, `@IsString()`, `@IsOptional()`, `@MinLength()`
- `PartialType` from `@nestjs/mapped-types`

---

### Step 1.2 - Category Module (CRUD)

**You will learn**: Same patterns reinforced, slug auto-generation

**Tasks**:

1. Generate module/controller/service for `category`
2. Create DTOs:
   - `CreateCategoryDto`: name (required, @IsString)
   - `UpdateCategoryDto`: PartialType
3. Implement service with auto-slug from name (reuse slug logic from PostService)
4. Implement controller:
   - `GET /categories`
   - `GET /categories/:id` (include related posts)
   - `POST /categories`
   - `PATCH /categories/:id`
   - `DELETE /categories/:id`

**Bonus**: Extract `buildSlug()` into a shared utility (`src/common/utils/slug.util.ts`) so Post and Category both use it.

---

### Step 1.3 - Tag Module (CRUD)

**You will learn**: Reinforcing patterns, many-to-many via join table

**Tasks**:

1. Generate module/controller/service for `tag`
2. Create DTOs:
   - `CreateTagDto`: name (required)
   - `UpdateTagDto`: PartialType
3. Implement service (auto-slug, include taggings count)
4. Implement controller:
   - `GET /tags`
   - `GET /tags/:id` (include posts via taggings)
   - `POST /tags`
   - `PATCH /tags/:id`
   - `DELETE /tags/:id`

---

### Step 1.4 - Post-Tag & Post-Category Relationships

**You will learn**: Managing many-to-many relations in Prisma, nested writes

**Tasks**:

1. Update `CreatePostDto` to accept:
   - `categoryIds?: number[]` (use `@IsArray`, `@IsInt({ each: true })`, `@IsOptional()`)
   - `tagIds?: number[]`

2. Update `PostService.create()`:
   - Connect categories: `categories: { connect: categoryIds.map(id => ({ id })) }`
   - Create taggings: `taggings: { create: tagIds.map(tagId => ({ tagId })) }`

3. Update `PostService.findAll()` and `findOne()`:
   - Include categories and taggings (with tag data)

4. Add endpoints to manage post tags:
   - `POST /posts/:id/tags` - add tags to a post
   - `DELETE /posts/:id/tags/:tagId` - remove tag from post

5. Add endpoints to manage post categories:
   - `POST /posts/:id/categories` - add categories
   - `DELETE /posts/:id/categories/:categoryId` - remove category

---

## Phase 2: Error Handling & API Quality

> **Goal**: Learn exceptions, filters, interceptors, pipes

---

### Step 2.1 - Proper Error Handling

**You will learn**: NestJS exception classes, custom exception filters

**Tasks**:

1. Add `NotFoundException` to services:
   ```typescript
   // In PostService.findOne()
   const post = await this.prisma.post.findUnique({ where: { id } });
   if (!post) throw new NotFoundException(`Post #${id} not found`);
   return post;
   ```
   Do the same for `update()`, `remove()` in all services.

2. Handle Prisma unique constraint errors:
   ```typescript
   // In UserService.create() - catch P2002 error
   try {
     return await this.prisma.user.create({ data });
   } catch (error) {
     if (error.code === 'P2002') {
       throw new ConflictException(`${error.meta.target} already exists`);
     }
     throw error;
   }
   ```

3. Create a global exception filter:
   - `src/common/filters/http-exception.filter.ts`
   - Standardize all error responses to: `{ statusCode, message, error, timestamp, path }`
   - Register globally in `main.ts`: `app.useGlobalFilters(new HttpExceptionFilter())`

**Key concepts**: `NotFoundException`, `ConflictException`, `BadRequestException`, `@Catch()`, `ExceptionFilter`

---

### Step 2.2 - Response Interceptor (Standardize API Responses)

**You will learn**: Interceptors, `Observable`, `map` operator

**Tasks**:

1. Create `src/common/interceptors/transform.interceptor.ts`:
   ```typescript
   // Wrap all responses in: { data: <response>, statusCode: 200, timestamp: ... }
   ```

2. Register globally in `main.ts` or via `APP_INTERCEPTOR`

**Key concepts**: `@UseInterceptors()`, `NestInterceptor`, `CallHandler`, `rxjs/operators map`

---

### Step 2.3 - Swagger / OpenAPI Documentation

**You will learn**: API documentation, decorators for Swagger

**Tasks**:

1. Install: `npm install @nestjs/swagger`
2. Set up in `main.ts`:
   ```typescript
   const config = new DocumentBuilder()
     .setTitle('NestJS Blog API')
     .setVersion('1.0')
     .addBearerAuth()
     .build();
   const document = SwaggerModule.createDocument(app, config);
   SwaggerModule.setup('api/docs', app, document);
   ```
3. Add decorators to DTOs: `@ApiProperty()`, `@ApiPropertyOptional()`
4. Add decorators to controllers: `@ApiTags()`, `@ApiOperation()`, `@ApiResponse()`
5. Visit `http://localhost:3000/api/docs` to see your docs

---

## Phase 3: Pagination, Filtering & Search

> **Goal**: Learn query params, advanced Prisma queries

---

### Step 3.1 - Pagination

**You will learn**: Query params, DTOs for queries, Prisma skip/take

**Tasks**:

1. Create `src/common/dto/pagination.dto.ts`:
   ```typescript
   export class PaginationDto {
     @IsOptional() @Type(() => Number) @IsInt() @Min(1)
     page?: number = 1;

     @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
     limit?: number = 10;
   }
   ```

2. Create a pagination response type:
   ```typescript
   { data: T[], meta: { total, page, limit, totalPages } }
   ```

3. Update `PostService.findAll()` to accept pagination:
   ```typescript
   const skip = (page - 1) * limit;
   const [data, total] = await Promise.all([
     this.prisma.post.findMany({ skip, take: limit, orderBy: { id: 'desc' } }),
     this.prisma.post.count(),
   ]);
   ```

4. Update `PostController.findAll()`: `@Query() query: PaginationDto`

5. Apply pagination to User, Category, Tag list endpoints too

---

### Step 3.2 - Filtering & Sorting

**You will learn**: Dynamic Prisma `where` clauses, `orderBy`

**Tasks**:

1. Create `src/post/dto/filter-post.dto.ts`:
   ```typescript
   export class FilterPostDto extends PaginationDto {
     @IsOptional() @IsBoolean() @Transform(({ value }) => value === 'true')
     published?: boolean;

     @IsOptional() @IsInt() @Type(() => Number)
     authorId?: number;

     @IsOptional() @IsInt() @Type(() => Number)
     categoryId?: number;

     @IsOptional() @IsString()
     sortBy?: 'createdAt' | 'title' = 'createdAt';

     @IsOptional() @IsString()
     order?: 'asc' | 'desc' = 'desc';
   }
   ```

2. Build dynamic `where` in service:
   ```typescript
   const where: Prisma.PostWhereInput = {};
   if (typeof published !== 'undefined') where.published = published;
   if (authorId) where.authorId = authorId;
   if (categoryId) where.categories = { some: { id: categoryId } };
   ```

3. Update controller to use `@Query() filter: FilterPostDto`

---

### Step 3.3 - Full-Text Search

**You will learn**: Prisma `contains` / `search`, query composition

**Tasks**:

1. Add `search` param to `FilterPostDto`:
   ```typescript
   @IsOptional() @IsString()
   search?: string;
   ```

2. Apply to `where`:
   ```typescript
   if (search) {
     where.OR = [
       { title: { contains: search, mode: 'insensitive' } },
       { content: { contains: search, mode: 'insensitive' } },
       { excerpt: { contains: search, mode: 'insensitive' } },
     ];
   }
   ```

3. Test: `GET /posts?search=nestjs&published=true&page=1&limit=5`

---

## Phase 4: Authentication & Authorization

> **Goal**: Learn Guards, JWT, Passport, role-based access control

---

### Step 4.1 - Authentication (JWT + Passport)

**You will learn**: AuthModule, JwtStrategy, LocalStrategy, Guards

**Tasks**:

1. Install packages:
   ```bash
   npm install @nestjs/passport passport @nestjs/jwt passport-jwt passport-local bcrypt
   npm install -D @types/passport-jwt @types/passport-local @types/bcrypt
   ```

2. Add `password` field to User model in Prisma:
   ```prisma
   model User {
     // ... existing fields
     password  String
   }
   ```
   Run `npx prisma migrate dev --name add-user-password`

3. Create `src/auth/` module:
   ```
   src/auth/
     auth.module.ts
     auth.controller.ts
     auth.service.ts
     dto/
       login.dto.ts        # email, password
       register.dto.ts     # email, password, password, firstName?, lastName?
     strategies/
       jwt.strategy.ts
       local.strategy.ts
     guards/
       jwt-auth.guard.ts
       local-auth.guard.ts
   ```

4. Implement `AuthService`:
   - `register(dto)` - hash password with bcrypt, create user
   - `validateUser(email, password)` - find user, compare password
   - `login(user)` - generate JWT token with `{ sub: user.id, email: user.email }`

5. Implement strategies:
   - `LocalStrategy` - validates email/password via `AuthService.validateUser()`
   - `JwtStrategy` - extracts user from JWT payload

6. Implement `AuthController`:
   - `POST /auth/register` - register new user
   - `POST /auth/login` - login, return `{ access_token }`
   - `GET /auth/profile` - return current user (protected with `@UseGuards(JwtAuthGuard)`)

7. Test the flow:
   ```bash
   # Register
   curl -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"123456"}'

   # Login
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"123456"}'

   # Access protected route
   curl http://localhost:3000/auth/profile \
     -H "Authorization: Bearer <token>"
   ```

---

### Step 4.2 - Protect Routes

**You will learn**: Applying guards selectively, custom decorators

**Tasks**:

1. Create a `@Public()` decorator to skip auth on specific routes:
   ```typescript
   // src/common/decorators/public.decorator.ts
   export const IS_PUBLIC_KEY = 'isPublic';
   export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
   ```

2. Make `JwtAuthGuard` global (in AppModule via `APP_GUARD`), then mark public routes with `@Public()`:
   - Public: `GET /posts`, `GET /posts/:id`, `GET /categories`, `GET /tags`, `POST /auth/login`, `POST /auth/register`
   - Protected: Everything else (create, update, delete)

3. Create `@CurrentUser()` param decorator to extract user from request:
   ```typescript
   // src/common/decorators/current-user.decorator.ts
   export const CurrentUser = createParamDecorator(
     (data: unknown, ctx: ExecutionContext) => {
       const request = ctx.switchToHttp().getRequest();
       return request.user;
     },
   );
   ```

4. Use `@CurrentUser()` in PostController.create() to auto-set authorId

---

### Step 4.3 - Role-Based Authorization (RBAC)

**You will learn**: Custom guards, metadata, Reflector

**Tasks**:

1. Add `role` field to User model:
   ```prisma
   enum Role {
     USER
     ADMIN
   }
   model User {
     // ...
     role Role @default(USER)
   }
   ```

2. Create `@Roles()` decorator:
   ```typescript
   export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
   ```

3. Create `RolesGuard`:
   ```typescript
   @Injectable()
   export class RolesGuard implements CanActivate {
     constructor(private reflector: Reflector) {}
     canActivate(context: ExecutionContext): boolean {
       const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
         context.getHandler(), context.getClass(),
       ]);
       if (!requiredRoles) return true;
       const { user } = context.switchToHttp().getRequest();
       return requiredRoles.includes(user.role);
     }
   }
   ```

4. Apply to routes:
   ```typescript
   @Delete(':id')
   @Roles(Role.ADMIN)
   remove(@Param('id', ParseIntPipe) id: number) { ... }
   ```

5. Also add ownership check: users can edit/delete their own posts, admins can edit/delete any post

---

## Phase 5: Advanced Features

> **Goal**: Learn file uploads, real-world patterns, caching

---

### Step 5.1 - File Upload (Avatar & Post Images)

**You will learn**: Multer integration, file validation, static serving

**Tasks**:

1. Install: `npm install @nestjs/platform-express` (already installed) + `multer`
2. Configure static file serving in `main.ts`:
   ```typescript
   app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });
   ```

3. Create upload endpoint for user avatar:
   ```typescript
   @Patch('avatar')
   @UseInterceptors(FileInterceptor('file', {
     storage: diskStorage({
       destination: './uploads/avatars',
       filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
     }),
     fileFilter: (req, file, cb) => {
       if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
         cb(new BadRequestException('Only image files allowed'), false);
       }
       cb(null, true);
     },
     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
   }))
   uploadAvatar(@UploadedFile() file: Express.Multer.File, @CurrentUser() user) {
     return this.userService.updateAvatar(user.id, `/uploads/avatars/${file.filename}`);
   }
   ```

4. Create upload endpoint for post featured image (add `featuredImage` field to Post model)

---

### Step 5.2 - Comments System

**You will learn**: Nested resources, self-referencing relations

**Tasks**:

1. Add Comment model to Prisma:
   ```prisma
   model Comment {
     id        Int       @id @default(autoincrement())
     content   String
     postId    Int
     post      Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
     authorId  Int
     author    User      @relation(fields: [authorId], references: [id])
     parentId  Int?
     parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
     replies   Comment[] @relation("CommentReplies")
     createdAt DateTime  @default(now())
     updatedAt DateTime  @updatedAt
   }
   ```

2. Run migration: `npx prisma migrate dev --name add-comments`

3. Create comment module/controller/service:
   - `GET /posts/:postId/comments` - list comments for a post (tree structure)
   - `POST /posts/:postId/comments` - create comment (auth required)
   - `PATCH /comments/:id` - edit own comment
   - `DELETE /comments/:id` - delete own comment (admin can delete any)

4. Build nested comment tree in service:
   ```typescript
   // Fetch flat list, then build tree
   const comments = await this.prisma.comment.findMany({
     where: { postId, parentId: null },
     include: {
       author: { select: { id: true, username: true, avatarUrl: true } },
       replies: {
         include: {
           author: { select: { id: true, username: true, avatarUrl: true } },
           replies: true, // 2 levels deep
         },
       },
     },
     orderBy: { createdAt: 'desc' },
   });
   ```

---

### Step 5.3 - Like / Bookmark System

**You will learn**: Toggle operations, unique constraints, aggregations

**Tasks**:

1. Add models to Prisma:
   ```prisma
   model Like {
     userId    Int
     postId    Int
     createdAt DateTime @default(now())
     user      User     @relation(fields: [userId], references: [id])
     post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
     @@id([userId, postId])
   }

   model Bookmark {
     userId    Int
     postId    Int
     createdAt DateTime @default(now())
     user      User     @relation(fields: [userId], references: [id])
     post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
     @@id([userId, postId])
   }
   ```

2. Implement toggle logic:
   - `POST /posts/:id/like` - toggle like (create if not exists, delete if exists)
   - `POST /posts/:id/bookmark` - toggle bookmark
   - `GET /posts/:id/likes` - get like count + whether current user liked
   - `GET /users/:id/bookmarks` - get user's bookmarked posts

---

### Step 5.4 - Caching

**You will learn**: Cache module, cache interceptor, TTL

**Tasks**:

1. Install: `npm install @nestjs/cache-manager cache-manager`
2. Register `CacheModule` in AppModule:
   ```typescript
   CacheModule.register({ ttl: 60, max: 100 })
   ```
3. Apply `@UseInterceptors(CacheInterceptor)` on GET endpoints
4. Invalidate cache on create/update/delete operations
5. Add cache to expensive queries (post list with filters, search)

---

### Step 5.5 - Rate Limiting

**You will learn**: Throttler guard, per-route configuration

**Tasks**:

1. Install: `npm install @nestjs/throttler`
2. Register in AppModule:
   ```typescript
   ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }])
   ```
3. Apply `ThrottlerGuard` globally via `APP_GUARD`
4. Override per-route:
   ```typescript
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   @Post('auth/login')  // Stricter rate limit on login
   ```

---

## Phase 6: Testing

> **Goal**: Learn unit testing, integration testing, e2e testing

---

### Step 6.1 - Unit Tests (Services)

**You will learn**: Jest, mocking Prisma, test structure

**Tasks**:

1. Create `post.service.spec.ts`:
   ```typescript
   describe('PostService', () => {
     let service: PostService;
     let prisma: DeepMockProxy<PrismaClient>;

     beforeEach(async () => {
       const module = await Test.createTestingModule({
         providers: [
           PostService,
           { provide: PrismaService, useValue: mockDeep<PrismaClient>() },
         ],
       }).compile();
       service = module.get(PostService);
       prisma = module.get(PrismaService);
     });

     it('should return all posts', async () => {
       const posts = [{ id: 1, title: 'Test' }];
       prisma.post.findMany.mockResolvedValue(posts);
       expect(await service.findAll()).toEqual(posts);
     });

     it('should throw NotFoundException', async () => {
       prisma.post.findUnique.mockResolvedValue(null);
       await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
     });
   });
   ```

2. Install: `npm install -D jest-mock-extended`
3. Write tests for all services (User, Category, Tag, Auth)
4. Run: `npm run test`

---

### Step 6.2 - E2E Tests

**You will learn**: Supertest, test database, app bootstrapping

**Tasks**:

1. Update `test/app.e2e-spec.ts`:
   ```typescript
   describe('PostController (e2e)', () => {
     let app: INestApplication;

     beforeAll(async () => {
       const moduleFixture = await Test.createTestingModule({
         imports: [AppModule],
       }).compile();
       app = moduleFixture.createNestApplication();
       app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
       await app.init();
     });

     it('/posts (GET)', () => {
       return request(app.getHttpServer())
         .get('/posts')
         .expect(200)
         .expect((res) => {
           expect(Array.isArray(res.body)).toBe(true);
         });
     });

     it('/posts (POST) - validation error', () => {
       return request(app.getHttpServer())
         .post('/posts')
         .send({})
         .expect(400);
     });

     afterAll(async () => {
       await app.close();
     });
   });
   ```

2. Run: `npm run test:e2e`

---

## Phase 7: Production Readiness

> **Goal**: Learn configuration, logging, health checks

---

### Step 7.1 - Configuration Module

**You will learn**: `@nestjs/config`, environment variables, validation

**Tasks**:

1. Install: `npm install @nestjs/config joi`
2. Create `.env.example` with all required env vars
3. Register ConfigModule:
   ```typescript
   ConfigModule.forRoot({
     isGlobal: true,
     validationSchema: Joi.object({
       DATABASE_URL: Joi.string().required(),
       JWT_SECRET: Joi.string().required(),
       JWT_EXPIRATION: Joi.string().default('1d'),
       PORT: Joi.number().default(3000),
     }),
   })
   ```
4. Replace all hardcoded values with `ConfigService.get()`

---

### Step 7.2 - Health Checks

**You will learn**: Terminus, health indicators

**Tasks**:

1. Install: `npm install @nestjs/terminus`
2. Create health module:
   - `GET /health` - check database connection, disk storage, memory

---

### Step 7.3 - Advanced Logging

**You will learn**: Custom logger, log levels, structured logging

**Tasks**:

1. Install: `npm install nestjs-pino pino-http pino-pretty`
2. Replace built-in logger with Pino for structured JSON logs
3. Add request ID tracking via middleware

---

## Recommended Learning Order (Summary)

| # | Task | Key NestJS Concepts |
|---|------|-------------------|
| 1 | User CRUD | Module, Controller, Service, DTO, Validation |
| 2 | Category CRUD | Reinforcing basics, shared utilities |
| 3 | Tag CRUD | Same patterns, many-to-many relations |
| 4 | Post relationships | Prisma nested writes, connect/disconnect |
| 5 | Error handling | Exceptions, ExceptionFilter, HttpException |
| 6 | Response interceptor | Interceptors, RxJS operators |
| 7 | Swagger docs | OpenAPI, decorator-based documentation |
| 8 | Pagination | Query params, Prisma skip/take, response meta |
| 9 | Filtering & sorting | Dynamic where, orderBy, Transform decorator |
| 10 | Search | Prisma contains, OR queries |
| 11 | Auth (JWT) | Passport, Guards, Strategies, bcrypt |
| 12 | Protect routes | Global guard, @Public(), @CurrentUser() |
| 13 | RBAC | Custom guard, Reflector, SetMetadata |
| 14 | File upload | Multer, FileInterceptor, static assets |
| 15 | Comments | Nested resources, self-referencing relations |
| 16 | Likes & bookmarks | Toggle operations, composite keys |
| 17 | Caching | CacheModule, CacheInterceptor, TTL |
| 18 | Rate limiting | ThrottlerModule, per-route config |
| 19 | Unit tests | Jest, mocking, test module |
| 20 | E2E tests | Supertest, app bootstrapping |
| 21 | Config module | @nestjs/config, env validation |
| 22 | Health checks | Terminus, health indicators |
| 23 | Advanced logging | Pino, structured logs, request ID |

---

## Tips

- **Always run `npx prisma migrate dev`** after schema changes
- **Always run `npx prisma generate`** to update the client types
- **Test each endpoint with curl or Postman** before moving to the next step
- **Read the NestJS docs** for each concept: https://docs.nestjs.com
- **Commit after each step** so you can track your progress
- **Ask me to help implement any step** - I'll guide you through the code!
