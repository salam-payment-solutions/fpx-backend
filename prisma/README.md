# Prisma Database Setup for NestJS

This document describes the organized Prisma setup for this NestJS TypeScript project.

## 📁 Organized File Structure

```
prisma/
├── schema.prisma           # Main schema file (organized)
├── seed.ts                # Database seeding script
└── migrations/            # Database migration files
    ├── migration_lock.toml
    └── [timestamp]_[name]/
        └── migration.sql

src/
├── prisma/
│   ├── prisma.module.ts   # Global Prisma module
│   └── prisma.service.ts  # Prisma service with connection handling
└── users/                 # Example module following NestJS patterns
    ├── users.module.ts
    ├── users.controller.ts
    ├── users.service.ts
    └── dto/
        ├── create-user.dto.ts
        └── update-user.dto.ts
```

## 🗃️ Schema Organization

The `schema.prisma` file is organized into clear sections:

### 1. **Database Configuration**
- Connection settings
- Provider configuration

### 2. **Generator Configuration**  
- Prisma Client generation settings
- Output directory configuration

### 3. **Enums**
- User roles (ADMIN, USER, MODERATOR)
- Account statuses (ACTIVE, INACTIVE, SUSPENDED, PENDING)

### 4. **Models**
- Well-documented User model
- Proper field mapping and indexing
- Timestamp conventions following NestJS patterns

### 5. **Future Models**
- Commented examples for Posts, Categories
- Ready to uncomment and extend

## 🚀 Available Scripts

```bash
# Prisma Commands
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Push schema to database (development)
npm run prisma:migrate   # Create and apply migration
npm run prisma:seed      # Seed the database
npm run prisma:studio    # Open Prisma Studio
npm run prisma:reset     # Reset database and seed
```

## 📋 Best Practices Implemented

### **1. Field Naming**
- **Database**: Snake_case (`first_name`, `created_at`)
- **TypeScript**: CamelCase (`firstName`, `createdAt`)  
- **Mapping**: Automatic via `@map()` directives

### **2. Indexing Strategy**
```prisma
@@index([email])        # Unique lookups
@@index([status])       # Filtering by status
@@index([role])         # Filtering by role
@@index([createdAt])    # Sorting by date
```

### **3. Timestamp Conventions**
- `createdAt`: Auto-set on creation
- `updatedAt`: Auto-updated on modification  
- `deletedAt`: For soft delete support

### **4. Type Safety**
- Strong typing with Prisma Client
- Enum validation at database level
- Optional fields properly marked

## 🔧 Integration with NestJS

### **Global Prisma Service**
```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }
}
```

### **Module Pattern**
```typescript
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### **Service Layer**
- Repository pattern implementation
- Business logic separation
- Type-safe query building

## 📝 Usage Examples

### **Create User**
```typescript
const user = await this.usersService.create({
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: Role.USER,
})
```

### **Query with Filters**
```typescript
const users = await this.usersService.findAll({
  where: {
    role: Role.ADMIN,
    emailVerified: true,
  },
  orderBy: { createdAt: 'desc' },
  take: 10,
})
```

## 🔄 Migration Workflow

1. **Modify Schema**: Update `schema.prisma`
2. **Create Migration**: `npm run prisma:migrate`
3. **Generate Client**: `npm run prisma:generate`  
4. **Update Code**: Adapt TypeScript code
5. **Test**: Verify everything works

## 🌱 Database Seeding

The seed script creates:
- Admin user (`admin@example.com`)
- Regular user (`user@example.com`)

Run with: `npm run prisma:seed`

## 🔍 Prisma Studio

Access your database visually:
```bash
npm run prisma:studio
```
Opens at: `http://localhost:5555`

## 📊 Performance Considerations

- **Indexes**: Added on frequently queried fields
- **Field Types**: Optimized VARCHAR lengths  
- **Relations**: Prepared for future relationships
- **Soft Deletes**: `deletedAt` field for data retention

This organization provides a solid foundation for scaling your NestJS application with Prisma!
