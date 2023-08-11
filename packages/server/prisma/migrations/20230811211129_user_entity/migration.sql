-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateTable
CREATE TABLE "public"."academic_term" (
    "academic_term_id" BIGSERIAL NOT NULL,
    "start_on" DATE NOT NULL,
    "end_on" DATE,
    "school_year_id" BIGINT NOT NULL,
    "term_number" INTEGER NOT NULL,

    CONSTRAINT "academic_term_pkey" PRIMARY KEY ("academic_term_id")
);

-- CreateTable
CREATE TABLE "public"."school_class" (
    "school_class_id" BIGSERIAL NOT NULL,
    "start_time" TIME(6) NOT NULL,
    "end_time" TIME(6) NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "teacher_id" BIGINT NOT NULL,
    "subject_id" BIGINT NOT NULL,
    "section_id" BIGINT NOT NULL,
    "class_name" TEXT,
    "academic_term_id" BIGINT NOT NULL,

    CONSTRAINT "school_class_pkey" PRIMARY KEY ("school_class_id")
);

-- CreateTable
CREATE TABLE "public"."school_year" (
    "school_year_id" BIGSERIAL NOT NULL,
    "school_year_name" TEXT NOT NULL,
    "open_on" DATE,
    "close_on" DATE,
    "academic_term_count" INTEGER NOT NULL,

    CONSTRAINT "school_year_pkey" PRIMARY KEY ("school_year_id")
);

-- CreateTable
CREATE TABLE "public"."senior_high_section" (
    "class_section_id" BIGINT NOT NULL,
    "senior_high_strand_id" BIGINT,
    "senior_high_track_id" BIGINT NOT NULL,

    CONSTRAINT "senior_high_section_pkey" PRIMARY KEY ("class_section_id")
);

-- CreateTable
CREATE TABLE "public"."senior_high_strand" (
    "senior_high_strand_id" BIGSERIAL NOT NULL,
    "senior_high_strand_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "senior_high_track_id" BIGINT,

    CONSTRAINT "senior_high_strand_pkey" PRIMARY KEY ("senior_high_strand_id")
);

-- CreateTable
CREATE TABLE "public"."senior_high_track" (
    "senior_high_track_id" BIGSERIAL NOT NULL,
    "senior_high_track_name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "senior_high_track_pkey" PRIMARY KEY ("senior_high_track_id")
);

-- CreateTable
CREATE TABLE "public"."subject" (
    "subject_id" BIGSERIAL NOT NULL,
    "subject_name" TEXT NOT NULL,
    "subject_short_name" TEXT NOT NULL,
    "color_hex" TEXT NOT NULL,
    "is_archived" BOOLEAN NOT NULL,
    "subject_category_id" BIGINT NOT NULL,

    CONSTRAINT "subject_pkey" PRIMARY KEY ("subject_id")
);

-- CreateTable
CREATE TABLE "public"."teacher" (
    "teacher_id" BIGSERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "name_suffix" TEXT,
    "nickname" TEXT NOT NULL,
    "sex" INTEGER NOT NULL,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "short_honorific" TEXT,

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("teacher_id")
);

-- CreateTable
CREATE TABLE "public"."year_level" (
    "year_level_id" BIGSERIAL NOT NULL,
    "year_level_name" TEXT NOT NULL,
    "year_level_short_name" TEXT NOT NULL,
    "sort_order" BIGSERIAL NOT NULL,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "year_level_pkey" PRIMARY KEY ("year_level_id")
);

-- CreateTable
CREATE TABLE "auth"."app_permission" (
    "app_permission_id" BIGSERIAL NOT NULL,
    "app_permission_name" TEXT NOT NULL,

    CONSTRAINT "app_permission_pkey" PRIMARY KEY ("app_permission_id")
);

-- CreateTable
CREATE TABLE "auth"."app_role" (
    "app_role_id" INTEGER NOT NULL,
    "app_role_name" TEXT NOT NULL,

    CONSTRAINT "app_role_pkey" PRIMARY KEY ("app_role_id")
);

-- CreateTable
CREATE TABLE "auth"."app_role_permission" (
    "app_role_permission_id" BIGSERIAL NOT NULL,
    "app_role_id" INTEGER NOT NULL,
    "app_permission_id" BIGINT NOT NULL,

    CONSTRAINT "app_role_permission_pkey" PRIMARY KEY ("app_role_permission_id")
);

-- CreateTable
CREATE TABLE "auth"."app_user" (
    "app_user_id" BIGSERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "user_status" TEXT NOT NULL DEFAULT 'active',
    "is_default" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "app_user_pkey" PRIMARY KEY ("app_user_id")
);

-- CreateTable
CREATE TABLE "auth"."app_user_role" (
    "app_user_role_id" BIGSERIAL NOT NULL,
    "app_user_id" BIGINT NOT NULL,
    "app_role_id" INTEGER NOT NULL,

    CONSTRAINT "app_user_role_pkey" PRIMARY KEY ("app_user_role_id")
);

-- CreateTable
CREATE TABLE "public"."subject_category" (
    "subject_category_id" BIGSERIAL NOT NULL,
    "subject_category_name" TEXT NOT NULL,

    CONSTRAINT "subject_category_pkey" PRIMARY KEY ("subject_category_id")
);

-- CreateTable
CREATE TABLE "public"."class_section" (
    "class_section_id" BIGSERIAL NOT NULL,
    "class_section_name" TEXT NOT NULL,
    "year_level_id" BIGINT NOT NULL,

    CONSTRAINT "class_section_pkey" PRIMARY KEY ("class_section_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "school_class_start_time_day_of_week_teacher_id_subject_id_secti" ON "public"."school_class"("start_time", "day_of_week", "teacher_id", "subject_id", "section_id", "class_name", "end_time");

-- CreateIndex
CREATE UNIQUE INDEX "senior_high_track_name_key" ON "public"."senior_high_track"("senior_high_track_name");

-- CreateIndex
CREATE UNIQUE INDEX "year_level_name_key" ON "public"."year_level"("year_level_name");

-- CreateIndex
CREATE UNIQUE INDEX "year_level_short_name_key" ON "public"."year_level"("year_level_short_name");

-- CreateIndex
CREATE UNIQUE INDEX "app_permission_name_key" ON "auth"."app_permission"("app_permission_name");

-- CreateIndex
CREATE UNIQUE INDEX "app_role_name_key" ON "auth"."app_role"("app_role_name");

-- CreateIndex
CREATE UNIQUE INDEX "app_role_permission_app_role_id_app_permission_id_key" ON "auth"."app_role_permission"("app_role_id", "app_permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "app_user_username_key" ON "auth"."app_user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "app_user_role_app_user_id_app_role_id_key" ON "auth"."app_user_role"("app_user_id", "app_role_id");

-- AddForeignKey
ALTER TABLE "public"."academic_term" ADD CONSTRAINT "academic_term_school_year_id_fkey" FOREIGN KEY ("school_year_id") REFERENCES "public"."school_year"("school_year_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."school_class" ADD CONSTRAINT "school_class_academic_term_id_fkey" FOREIGN KEY ("academic_term_id") REFERENCES "public"."academic_term"("academic_term_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."school_class" ADD CONSTRAINT "school_class_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."class_section"("class_section_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."school_class" ADD CONSTRAINT "school_class_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subject"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."school_class" ADD CONSTRAINT "school_class_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "public"."teacher"("teacher_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."senior_high_section" ADD CONSTRAINT "senior_high_section_section_id_fkey" FOREIGN KEY ("class_section_id") REFERENCES "public"."class_section"("class_section_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."senior_high_section" ADD CONSTRAINT "senior_high_section_senior_high_strand_id_fkey" FOREIGN KEY ("senior_high_strand_id") REFERENCES "public"."senior_high_strand"("senior_high_strand_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."senior_high_section" ADD CONSTRAINT "senior_high_section_senior_high_track_id_fkey" FOREIGN KEY ("senior_high_track_id") REFERENCES "public"."senior_high_track"("senior_high_track_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."senior_high_strand" ADD CONSTRAINT "senior_high_strand_senior_high_track_id_fkey" FOREIGN KEY ("senior_high_track_id") REFERENCES "public"."senior_high_track"("senior_high_track_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."subject" ADD CONSTRAINT "subject_subject_category_id_fkey" FOREIGN KEY ("subject_category_id") REFERENCES "public"."subject_category"("subject_category_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."app_role_permission" ADD CONSTRAINT "app_role_permission_app_permission_id_fkey" FOREIGN KEY ("app_permission_id") REFERENCES "auth"."app_permission"("app_permission_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."app_role_permission" ADD CONSTRAINT "app_role_permission_app_role_id_fkey" FOREIGN KEY ("app_role_id") REFERENCES "auth"."app_role"("app_role_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."app_user_role" ADD CONSTRAINT "app_user_role_app_role_id_fkey" FOREIGN KEY ("app_role_id") REFERENCES "auth"."app_role"("app_role_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."app_user_role" ADD CONSTRAINT "app_user_role_app_user_id_fkey" FOREIGN KEY ("app_user_id") REFERENCES "auth"."app_user"("app_user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."class_section" ADD CONSTRAINT "class_section_year_level_id_fkey" FOREIGN KEY ("year_level_id") REFERENCES "public"."year_level"("year_level_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
