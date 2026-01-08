-- CreateTable
CREATE TABLE "ContractType" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContractType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "collaboratorId" TEXT NOT NULL,
    "number" TEXT,
    "contractTypeId" TEXT,
    "startDate" TIMESTAMP(3),
    "hireDate" TIMESTAMP(3),
    "endDatePlanned" TIMESTAMP(3),
    "durationPlanned" INTEGER,
    "endDateReal" TIMESTAMP(3),
    "durationReal" INTEGER,
    "probationPeriod" INTEGER,
    "hours" DOUBLE PRECISION,
    "attachment" TEXT,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContractType_companyId_idx" ON "ContractType"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "ContractType_companyId_name_key" ON "ContractType"("companyId", "name");

-- CreateIndex
CREATE INDEX "Contract_companyId_idx" ON "Contract"("companyId");

-- CreateIndex
CREATE INDEX "Contract_collaboratorId_idx" ON "Contract"("collaboratorId");

-- AddForeignKey
ALTER TABLE "ContractType" ADD CONSTRAINT "ContractType_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_contractTypeId_fkey" FOREIGN KEY ("contractTypeId") REFERENCES "ContractType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
