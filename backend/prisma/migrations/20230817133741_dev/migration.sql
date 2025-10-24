-- CreateTable
CREATE TABLE "Visitante" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "orgaoEmissor" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "nip" TEXT,
    "telefone" TEXT NOT NULL,
    "crachaProprio" BOOLEAN NOT NULL,

    CONSTRAINT "Visitante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registro" (
    "id" TEXT NOT NULL,
    "visitanteId" TEXT NOT NULL,
    "entrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "saida" TIMESTAMP(3),
    "destino" TEXT,
    "idCracha" TEXT,
    "numeroCracha" INTEGER,

    CONSTRAINT "Registro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cracha" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,

    CONSTRAINT "Cracha_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Visitante_cpf_key" ON "Visitante"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Visitante_nip_key" ON "Visitante"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "Registro_idCracha_key" ON "Registro"("idCracha");

-- CreateIndex
CREATE UNIQUE INDEX "Cracha_numero_key" ON "Cracha"("numero");

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_visitanteId_fkey" FOREIGN KEY ("visitanteId") REFERENCES "Visitante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_idCracha_fkey" FOREIGN KEY ("idCracha") REFERENCES "Cracha"("id") ON DELETE SET NULL ON UPDATE CASCADE;
