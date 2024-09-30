-- CreateFunction
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

/*
  Warnings:

  - You are about to drop the column `wasReminded` on the `bookings` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "notification_status" AS ENUM ('PENDING', 'SENT', 'FAILED', 'CANCELLED');

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "wasReminded";

-- CreateTable
CREATE TABLE "notification_queue" (
    "id" SERIAL NOT NULL,
    "client_id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "notification_status" NOT NULL DEFAULT 'PENDING',
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "scheduled_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sent_at" TIMESTAMP(3),
    "error" JSONB,
    "booking_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTrigger
CREATE TRIGGER update_notification_queue_updated_at
BEFORE UPDATE ON "notification_queue"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
