import { RichText as LexicalRichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { DefaultNodeTypes, SerializedBlockNode, SerializedUploadNode } from '@payloadcms/richtext-lexical'
import Image from 'next/image'
import type { CalloutBlock, GalleryBlock, Media, VideoEmbedBlock } from '@/payload-types'
import { VideoEmbed } from './VideoEmbed'
import { asMedia, cx, fileExt, fileSize, mediaUrl } from '@/lib/utils'
import { DownloadIcon } from './Icons'

type Nodes = DefaultNodeTypes | SerializedBlockNode<VideoEmbedBlock | CalloutBlock | GalleryBlock>

const calloutStyles: Record<string, string> = {
  info: 'border-sky-500/40 bg-sky-500/5',
  tip: 'border-emerald-500/40 bg-emerald-500/5',
  warning: 'border-amber-500/50 bg-amber-500/5',
  takeaway: 'border-accent/50 bg-accent-soft',
}

const UploadNode = ({ node }: { node: SerializedUploadNode }) => {
  const m = asMedia(node.value) as Media | null
  if (!m?.url) return null
  const caption = (node.fields as { caption?: string } | undefined)?.caption
  if (m.mimeType?.startsWith('video')) {
    return (
      <figure className="not-prose my-8">
        <video controls preload="metadata" playsInline className="w-full rounded-xl bg-black" src={mediaUrl(m.url)}>
          <track kind="captions" />
        </video>
        {caption && <figcaption className="mt-2 text-center text-sm text-muted">{caption}</figcaption>}
      </figure>
    )
  }
  if (m.mimeType?.startsWith('image')) {
    const large = m.sizes?.large
    return (
      <figure className="my-8">
        <Image
          src={mediaUrl(large?.url || m.url)}
          width={large?.width || m.width || 1600}
          height={large?.height || m.height || 900}
          alt={m.alt || caption || ''}
          sizes="(min-width: 768px) 720px, 100vw"
          className="rounded-xl"
        />
        {(caption || m.credit) && (
          <figcaption className="text-center">
            {caption}
            {m.credit && <span className="block text-xs opacity-80">{m.credit}</span>}
          </figcaption>
        )}
      </figure>
    )
  }
  return (
    <p>
      <a href={m.url} className="inline-flex items-center gap-2" download>
        <DownloadIcon className="size-4" />
        {m.alt || m.filename} <span className="text-sm text-muted">({fileExt(m.filename)} {fileSize(m.filesize)})</span>
      </a>
    </p>
  )
}

const converters: JSXConvertersFunction<Nodes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: ({ node }) => <UploadNode node={node} />,
  blocks: {
    videoEmbed: ({ node }) => <VideoEmbed url={node.fields.url} caption={node.fields.caption} />,
    callout: ({ node }) => (
      <aside className={cx('not-prose my-6 rounded-xl border-l-4 p-5', calloutStyles[node.fields.style || 'info'])}>
        {node.fields.title && <p className="mb-1 font-semibold text-ink">{node.fields.title}</p>}
        <p className="whitespace-pre-line text-ink/90">{node.fields.body}</p>
      </aside>
    ),
    gallery: ({ node }) => {
      const imgs = (node.fields.images || []).map(asMedia).filter(Boolean) as Media[]
      return (
        <figure className="not-prose my-8">
          <div className={cx('grid gap-3', imgs.length > 1 && 'grid-cols-2', imgs.length > 4 && 'md:grid-cols-3')}>
            {imgs.map((m) => (
              <a key={m.id} href={m.url || '#'} target="_blank" rel="noopener noreferrer" className="relative block aspect-[4/3] overflow-hidden rounded-lg">
                <Image src={mediaUrl(m.sizes?.card?.url || m.url)} alt={m.alt || ''} fill sizes="(min-width: 768px) 360px, 50vw" className="object-cover transition hover:scale-[1.02]" />
              </a>
            ))}
          </div>
          {node.fields.caption && <figcaption className="mt-2 text-center text-sm text-muted">{node.fields.caption}</figcaption>}
        </figure>
      )
    },
  },
})

export function RichText({ data, className }: { data: unknown; className?: string }) {
  if (!data) return null
  return (
    <LexicalRichText
      data={data as SerializedEditorState}
      converters={converters}
      className={cx('prose prose-site max-w-none prose-lg prose-img:rounded-xl prose-a:underline-offset-4', className)}
    />
  )
}
