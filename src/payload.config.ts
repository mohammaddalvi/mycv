import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Activities } from './collections/Activities'
import { Courses } from './collections/Courses'
import { Education } from './collections/Education'
import { Experiences } from './collections/Experiences'
import { Grants } from './collections/Grants'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Projects } from './collections/Projects'
import { Publications } from './collections/Publications'
import { Resources } from './collections/Resources'
import { Supervisions } from './collections/Supervisions'
import { Users } from './collections/Users'
import { Profile } from './globals/Profile'
import { simpleEditor } from './lib/editor'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · Website admin' },
    components: {
      graphics: { Logo: '@/components/admin/Logo', Icon: '@/components/admin/Icon' },
      beforeDashboard: ['@/components/admin/Welcome'],
    },
  },
  collections: [
    Posts,
    Publications,
    Grants,
    Experiences,
    Education,
    Projects,
    Activities,
    Courses,
    Resources,
    Supervisions,
    Media,
    Users,
  ],
  globals: [Profile],
  editor: simpleEditor,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    // Schema changes are tracked as migrations (src/migrations) and applied on build.
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  upload: { limits: { fileSize: 200 * 1024 * 1024 } },
  sharp,
  plugins: [
    // Store uploads on Vercel Blob when a token is configured (production on Vercel).
    // Without a token, files are stored on local disk under /uploads.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true, resources: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      clientUploads: true,
    }),
  ],
})
