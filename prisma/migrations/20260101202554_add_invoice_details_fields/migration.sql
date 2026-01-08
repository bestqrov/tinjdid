-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "clientId" TEXT,
ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "dateDelivrance" TIMESTAMP(3),
ADD COLUMN     "lines" JSONB,
ADD COLUMN     "numero" TEXT,
ADD COLUMN     "numeroAttestation" TEXT,
ADD COLUMN     "periodeFacturation" TEXT,
ADD COLUMN     "tvaPercent" DOUBLE PRECISION;
