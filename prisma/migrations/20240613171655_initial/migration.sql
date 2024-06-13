-- CreateTable
CREATE TABLE "Summary" (
    "id" STRING NOT NULL,
    "text" STRING NOT NULL,
    "projectName" STRING NOT NULL,

    CONSTRAINT "Summary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projects" (
    "id" STRING NOT NULL,
    "text" STRING NOT NULL,
    "projectName" STRING NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Summary_text_key" ON "Summary"("text");

-- CreateIndex
CREATE UNIQUE INDEX "Projects_text_key" ON "Projects"("text");
