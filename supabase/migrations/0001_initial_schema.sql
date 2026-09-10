-- 0001_initial_schema.sql
-- Arcivis initial database schema for Supabase
-- Generated for Stage 5: Supabase Implementation
-- Strictly follows SCHEMA.md §3 field-for-field

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================================
-- profiles
-- ============================================================================
create table profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    name text not null,
    role text not null default 'member' check (role in ('guest','member','reviewer','verifier','admin'))
);

-- ============================================================================
-- subjects
-- ============================================================================
create table subjects (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    icon_name text
);

-- ============================================================================
-- content
-- Unified table for Learning, Articles, and Practice Packages
-- ============================================================================
create table content (
    id uuid primary key default gen_random_uuid(),
    type text not null,
    title text not null,
    description text,
    status text not null default 'draft' check (status in ('draft','direview','diverifikasi')),
    cover_image text,
    author_id uuid not null references profiles(id) on delete cascade,
    subject_id uuid references subjects(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Indexes for frequently queried columns
create index idx_content_author_id on content(author_id);
create index idx_content_subject_id on content(subject_id);
create index idx_content_type on content(type);

-- ============================================================================
-- content_resources
-- ============================================================================
create table content_resources (
    id uuid primary key default gen_random_uuid(),
    content_id uuid not null references content(id) on delete cascade,
    resource_type text not null,
    url text not null
);

-- ============================================================================
-- tags
-- ============================================================================
create table tags (
    id uuid primary key default gen_random_uuid(),
    name text not null unique
);

-- ============================================================================
-- content_tags (join table)
-- ============================================================================
create table content_tags (
    content_id uuid not null references content(id) on delete cascade,
    tag_id uuid not null references tags(id) on delete cascade,
    primary key (content_id, tag_id)
);

-- ============================================================================
-- bookmarks (join table)
-- ============================================================================
create table bookmarks (
    user_id uuid not null references profiles(id) on delete cascade,
    content_id uuid not null references content(id) on delete cascade,
    primary key (user_id, content_id)
);

-- ============================================================================
-- questions
-- ============================================================================
create table questions (
    id uuid primary key default gen_random_uuid(),
    content_id uuid not null references content(id) on delete cascade,
    text text not null,
    options jsonb not null,
    correct_index integer not null,
    explanation text,
    difficulty text,
    topic text
);

create index idx_questions_content_id on questions(content_id);

-- ============================================================================
-- attempts
-- ============================================================================
create table attempts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references profiles(id) on delete cascade,
    content_id uuid references content(id) on delete set null,
    generator_config jsonb,
    score integer,
    completed_at timestamptz
);

create index idx_attempts_user_id on attempts(user_id);
create index idx_attempts_content_id on attempts(content_id);

-- ============================================================================
-- announcements
-- ============================================================================
create table announcements (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    body text not null
);

-- ============================================================================
-- schedules
-- ============================================================================
create table schedules (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    event_date date not null
);