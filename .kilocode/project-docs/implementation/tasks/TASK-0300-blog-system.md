# TASK-0300: Configure Blog System with MDX

**Phase**: 3 - Blog System  
**Status**: Complete  
**Priority**: High  
**Estimated Effort**: 3 hours

---

## Description

Set up Astro content collections for MDX blog posts with proper configuration.

---

## Acceptance Criteria

- [ ] Content collection configured for blog posts
- [ ] MDX support enabled
- [ ] Blog post schema defined (title, date, tags, etc.)
- [ ] Blog index page created
- [ ] Dynamic blog post routing working

---

## Steps

### 1.1 Install MDX Integration
```bash
npx astro add mdx
```

### 1.2 Configure Content Collection
File: `src/content/config.ts`

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

### 1.3 Create Blog Post Layout
File: `src/layouts/BlogPost.astro`

```astro
---
import Layout from './Layout.astro';
import Container from '../components/common/Container.astro';
import { type CollectionEntry } from 'astro:content';

interface Props {
  post: CollectionEntry<'blog'>;
}

const { post } = Astro.props;
const { title, description, pubDate, tags } = post.data;
---

<Layout title={title} description={description}>
  <Container>
    <article class="py-12 max-w-3xl mx-auto">
      <header class="mb-8">
        <h1 class="text-4xl font-heading font-bold mb-4">{title}</h1>
        <time class="text-textMuted">
          {pubDate.toLocaleDateString('en-US', { dateStyle: 'long' })}
        </time>
        <div class="flex gap-2 mt-4">
          {tags.map((tag) => (
            <span class="text-sm text-primary">#{tag}</span>
          ))}
        </div>
      </header>
      
      <div class="prose prose-invert max-w-none">
        <slot />
      </div>
    </article>
  </Container>
</Layout>
```

### 1.4 Create Blog Index Page
File: `src/pages/blog/index.astro`

```astro
---
import Layout from '../../layouts/Layout.astro';
import Container from '../../components/common/Container.astro';
import Card from '../../components/common/Card.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog'))
  .filter((post) => !post.data.draft)
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---

<Layout title="Blog">
  <Container>
    <h1 class="text-4xl font-heading font-bold py-12">Blog</h1>
    
    <div class="grid gap-6">
      {posts.map((post) => (
        <a href={`/blog/${post.slug}`}>
          <Card hover>
            <h2 class="text-xl font-bold mb-2">{post.data.title}</h2>
            <p class="text-textMuted mb-4">{post.data.description}</p>
            <time class="text-sm text-textMuted">
              {post.data.pubDate.toLocaleDateString()}
            </time>
          </Card>
        </a>
      ))}
    </div>
  </Container>
</Layout>
```

### 1.5 Create Dynamic Blog Post Route
File: `src/pages/blog/[...slug].astro`

```astro
---
import { getCollection } from 'astro:content';
import BlogPost from '../../layouts/BlogPost.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<BlogPost post={post}>
  <Content />
</BlogPost>
```

---

## Dependencies

- TASK-0100: Astro project initialized
- TASK-0101: Tailwind configured
- TASK-0104: UI components (Card)
