-- AlterTable
-- Add new localized name columns
ALTER TABLE "categories" ADD COLUMN "name_ru" TEXT;
ALTER TABLE "categories" ADD COLUMN "name_en" TEXT;
ALTER TABLE "categories" ADD COLUMN "name_kk" TEXT;

-- Copy existing name to name_ru (assuming existing data is in Russian)
UPDATE "categories" SET "name_ru" = "name", "name_en" = "name", "name_kk" = "name" WHERE "name_ru" IS NULL;

-- Make new columns NOT NULL after data migration
ALTER TABLE "categories" ALTER COLUMN "name_ru" SET NOT NULL;
ALTER TABLE "categories" ALTER COLUMN "name_en" SET NOT NULL;
ALTER TABLE "categories" ALTER COLUMN "name_kk" SET NOT NULL;

-- Drop old name column
ALTER TABLE "categories" DROP COLUMN "name";



