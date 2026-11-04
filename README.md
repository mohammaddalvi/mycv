# Academic personal website

Personal website of Ts Dr Mohammad Dalvi Esfahani, with a built-in admin dashboard.

* **Public site**: Home, About, Experience, Publications (filter by type/year, search, APA/BibTeX citations), Teaching (courses + supervision), Resources (downloadable teaching materials), Blog (photos, uploaded videos, YouTube/Vimeo embeds, galleries, callouts), Contact.
* **Admin dashboard** at `/admin`: log in to add, edit or remove anything on the site. Changes go live within seconds.
* **Fast and SEO-friendly**: every page is pre-rendered (static HTML), images are resized and served as AVIF/WebP, fonts are self-hosted, and the site ships a sitemap, robots.txt, RSS feed, Open Graph images and schema.org data (Person, ScholarlyArticle, BlogPosting, Course).

Built with Next.js 16, Payload CMS 3, Postgres and Tailwind CSS 4.

## Using the dashboard

| To do this | Go to |
| --- | --- |
| Change name, photo, bio, research interests, skills, contact links, CV PDF, SEO text | Settings → Profile & site settings |
| Write a blog post (drafts, autosave, scheduled publishing) | Blog → Blog posts |
| Add a publication (journal, conference, book, chapter, preprint, thesis, report) | Research → Publications |
| Add a position or leadership role | Career → Experience |
| Upload slides, notes, datasets, code | Teaching → Teaching resources (link it to a course to show it on that course page) |
| Add a course | Teaching → Courses |
| Add a supervised thesis | Teaching → Supervision |
| Add a talk, workshop, training, affiliation, reviewing or award | Career → Talks, service & awards |

In the blog editor, use the **+** button for images, video files, YouTube/Vimeo videos, galleries and callout boxes. Tick **Featured** on publications to show them on the home page. Add a DOI to a publication to get a direct DOI link.

## Deploy on Vercel (recommended, free tier)

1. Push this repository to GitHub.
2. In Vercel, **Add New → Project** and import the repository.
3. In the project's **Storage** tab add a **Neon Postgres** database and a **Blob** store. Vercel sets `DATABASE_URL` (Neon may call it `POSTGRES_URL`; copy it into `DATABASE_URL`) and `BLOB_READ_WRITE_TOKEN`.
4. Add environment variables `PAYLOAD_SECRET` (a long random string) and `NEXT_PUBLIC_SITE_URL` (e.g. `https://dalvi.academy`).
5. Deploy. The build runs database migrations automatically.
6. The first build fills the empty database with the CV content automatically. Open `https://<your-site>/admin` and create your admin account (the first account becomes the admin).
7. Add your custom domain under **Settings → Domains**, then update `NEXT_PUBLIC_SITE_URL` and redeploy.
8. Submit `https://your-domain/sitemap.xml` in Google Search Console.

## Self-host with Docker

```bash
cp .env.example .env   # set PAYLOAD_SECRET and NEXT_PUBLIC_SITE_URL
docker compose up -d
docker compose exec web pnpm seed   # optional: load CV content
```

Uploaded files are stored in `./uploads` (back it up together with the database).

## Local development

```bash
pnpm install
cp .env.example .env        # point DATABASE_URL at a local Postgres
pnpm payload migrate
SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD=secret pnpm seed
pnpm dev                    # http://localhost:3000 and /admin
```

If you change collection fields, run `pnpm payload migrate:create <name>` and commit the new file in `src/migrations`.

## Project layout

* `src/collections`, `src/globals`: dashboard content types
* `src/app/(frontend)`: public pages
* `src/components`: UI components
* `src/seed`: CV content used for the initial import
