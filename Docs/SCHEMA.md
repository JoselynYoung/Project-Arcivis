# Arcivis Database Schema

**Stage:** Stage 4 — Database Design

---

## 1. Overview

This document defines the database schema for Arcivis. It describes each entity, its fields, the relationships between entities, the rationale behind key design decisions, and the scope explicitly excluded from this stage.

A visual entity-relationship diagram accompanies this document (`arcivis-erd.html`).

## 2. Design Principle

Arcivis is organized around a single central entity: **Content**. Learning materials, Articles, and Practice packages are treated as instances of this one entity, distinguished by a `type` field, rather than as separate, independently modeled systems. This reflects the platform's core identity as a unified knowledge archive and ensures that cross-cutting features — bookmarking, contribution tracking, review status — apply uniformly across all content types.

## 3. Entities

### 3.1 `profiles`

Represents a platform user.

| Column | Type   | Description                                                |
| ------ | ------ | ---------------------------------------------------------- |
| id     | uuid   | Primary key                                                |
| name   | string | Display name                                               |
| role   | string | `guest` \| `member` \| `reviewer` \| `verifier` \| `admin` |

### 3.2 `content`

The central entity. All Learning, Article, and Practice records are stored here.

| Column      | Type             | Description                                                                                                                                     |
| ----------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| id          | uuid             | Primary key                                                                                                                                     |
| type        | string           | Content category. Stored as free text rather than an enumerated type, allowing new categories to be introduced without a schema migration.      |
| title       | string           |                                                                                                                                                 |
| description | string           |                                                                                                                                                 |
| status      | string           | `draft` \| `direview` \| `diverifikasi`                                                                                                         |
| cover_image | string, nullable | Contributor-supplied cover image. When absent, the interface applies a default gradient-and-icon treatment.                                     |
| author_id   | uuid             | Foreign key → `profiles.id`. The display label ("Penulis", "Penyusun", "Kontributor") is determined by `type` at render time and is not stored. |
| subject_id  | uuid, nullable   | Foreign key → `subjects.id`. Nullable, as not all content maps to a defined school subject.                                                     |
| created_at  | timestamp        |                                                                                                                                                 |
| updated_at  | timestamp        |                                                                                                                                                 |

### 3.3 `content_resources`

Attachments associated with a content record (documents, video, external links).

| Column        | Type   | Description                 |
| ------------- | ------ | --------------------------- |
| id            | uuid   | Primary key                 |
| content_id    | uuid   | Foreign key → `content.id`  |
| resource_type | string | e.g. `pdf`, `video`, `link` |
| url           | string |                             |

### 3.4 `subjects`

Reference table for academic subjects.

| Column    | Type   | Description               |
| --------- | ------ | ------------------------- |
| id        | uuid   | Primary key               |
| name      | string |                           |
| icon_name | string | Maps to an interface icon |

### 3.5 `tags` and `content_tags`

Free-form keyword classification, associated with content in a many-to-many relationship. Used for content that does not map cleanly to a `subject`.

**`tags`**

| Column | Type   | Description |
| ------ | ------ | ----------- |
| id     | uuid   | Primary key |
| name   | string |             |

**`content_tags`**

| Column     | Type | Description                |
| ---------- | ---- | -------------------------- |
| content_id | uuid | Foreign key → `content.id` |
| tag_id     | uuid | Foreign key → `tags.id`    |

### 3.6 `bookmarks`

Records a user's saved content, applicable uniformly across all content types.

| Column     | Type | Description                 |
| ---------- | ---- | --------------------------- |
| user_id    | uuid | Foreign key → `profiles.id` |
| content_id | uuid | Foreign key → `content.id`  |

### 3.7 `questions`

Questions associated with a content record of type `practice`.

| Column        | Type   | Description                |
| ------------- | ------ | -------------------------- |
| id            | uuid   | Primary key                |
| content_id    | uuid   | Foreign key → `content.id` |
| text          | string |                            |
| options       | json   |                            |
| correct_index | int    |                            |
| explanation   | string |                            |
| difficulty    | string |                            |
| topic         | string |                            |

### 3.8 `attempts`

Records a completed practice or quiz session.

| Column           | Type           | Description                                                                                                         |
| ---------------- | -------------- | ------------------------------------------------------------------------------------------------------------------- |
| id               | uuid           | Primary key                                                                                                         |
| user_id          | uuid           | Foreign key → `profiles.id`                                                                                         |
| content_id       | uuid, nullable | Foreign key → `content.id`. Null when the session originates from the Quiz Generator rather than a curated package. |
| generator_config | json, nullable | Stores the selected subject, topic, difficulty, and mode when `content_id` is null.                                 |
| score            | int            |                                                                                                                     |
| completed_at     | timestamp      |                                                                                                                     |

Aggregate statistics (session count, accuracy, total questions completed) are derived from this table at query time rather than stored redundantly.

### 3.9 `announcements`

| Column | Type   | Description |
| ------ | ------ | ----------- |
| id     | uuid   | Primary key |
| title  | string |             |
| body   | string |             |

### 3.10 `schedules`

| Column     | Type   | Description |
| ---------- | ------ | ----------- |
| id         | uuid   | Primary key |
| title      | string |             |
| event_date | date   |             |

## 4. Design Decisions

**4.1 Unified content table.** A single `content` table was chosen over separate tables per content type. This avoids requiring every cross-content feature (bookmarking, contribution history, moderation status) to query and merge results across multiple tables, and keeps the schema consistent with the platform's content model. Fields specific to a single content type (such as question data) are stored in attached tables rather than as additional nullable columns on `content`.

**4.2 Free-text content type.** The `type` field on `content` is stored as a string rather than a database-level enumeration, permitting new content categories to be added through data insertion alone.

**4.3 Nullable subject reference.** `content.subject_id` is nullable to accommodate content that does not correspond to a defined academic subject. Such content is classified through `tags` instead.

**4.4 No dedicated statistics table.** Aggregate metrics are computed from `attempts` on demand rather than maintained as separate running totals, avoiding a class of data-synchronization issues at a scale where computed aggregation is not a performance concern.

## 5. Scope Excluded from Stage 4

The following entities were considered and are explicitly excluded from the current schema.

| Entity                                            | Rationale                                                                                                                                                                                                                                    | Planned Stage                                                       |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `collections`, `collection_items`                 | Would support curated, cross-content-type groupings for homepage presentation. No corresponding interface has been implemented.                                                                                                              | Reassess when homepage curation requires database-driven management |
| `organizations`                                   | Would store partner metadata for collaborative content initiatives. No management interface exists.                                                                                                                                          | Alongside `collections`                                             |
| `comments`, `reviews`, `verifications`, `reports` | Belong to the Community Features stage. No corresponding interface elements exist. The `content.status` field already supports the required draft/review/verification states for contribution tracking; detailed audit records are excluded. | Stage 7 — Community Features                                        |
| `material` (as a distinct entity)                 | Functionally redundant with `content_resources`.                                                                                                                                                                                             | Not planned                                                         |

## 6. Validation Summary

This schema was validated against the following criteria prior to approval:

1. All interface pages defined through Stage 2 have corresponding data support in this schema.
2. Migration from mock data to this schema does not require interface changes, as mock data structures were designed to approximate the eventual data model.
3. No entity included in this schema lacks a defined, current use case.
