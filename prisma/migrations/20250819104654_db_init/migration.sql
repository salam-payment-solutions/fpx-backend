-- CreateEnum
CREATE TYPE "public"."roles" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "public"."account_statuses" AS ENUM ('active', 'inactive', 'suspended', 'pending');

-- CreateEnum
CREATE TYPE "public"."default_statuses" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "public"."payment_statuses" AS ENUM ('pending', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "public"."PaymentMessageToken" AS ENUM ('B2C', 'B2B1', 'B2B2');

-- CreateTable
CREATE TABLE "public"."banks" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "display_name" VARCHAR(255),
    "is_b2c" BOOLEAN NOT NULL DEFAULT false,
    "is_b2b" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."default_statuses" NOT NULL DEFAULT 'inactive',

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fpx_seller_exchange" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "seller_id" VARCHAR(10) NOT NULL,
    "exchange_id" VARCHAR(10) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fpx_seller_exchange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" SERIAL NOT NULL,
    "transaction_id" VARCHAR(40),
    "exchange_order_no" VARCHAR(40) NOT NULL,
    "order_no" VARCHAR(40) NOT NULL,
    "reference_no" VARCHAR(30) NOT NULL,
    "description" VARCHAR(30) NOT NULL,
    "type" "public"."PaymentMessageToken" NOT NULL,
    "payer_email" VARCHAR(255) NOT NULL,
    "payer_phone" VARCHAR(15) NOT NULL,
    "payer_name" VARCHAR(255) NOT NULL,
    "amount" DECIMAL(16,2) NOT NULL,
    "seller_id" VARCHAR(10) NOT NULL,
    "exchange_id" VARCHAR(10) NOT NULL,
    "fpx_transaction_time" VARCHAR(30) NOT NULL,
    "status" "public"."payment_statuses" NOT NULL DEFAULT 'pending',
    "is_flagged" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "fpxSellerExchangeId" INTEGER NOT NULL,
    "bank_id" INTEGER NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "user_id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255),
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "full_name" VARCHAR(200),
    "avatar" TEXT,
    "bio" TEXT,
    "role" "public"."roles" NOT NULL DEFAULT 'user',
    "status" "public"."account_statuses" NOT NULL DEFAULT 'pending',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL,
    "deleted_at" TIMESTAMP(0),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "banks_code_key" ON "public"."banks"("code");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "public"."users"("status");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "public"."users"("role");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "public"."users"("created_at");

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_fpxSellerExchangeId_fkey" FOREIGN KEY ("fpxSellerExchangeId") REFERENCES "public"."fpx_seller_exchange"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "public"."banks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
