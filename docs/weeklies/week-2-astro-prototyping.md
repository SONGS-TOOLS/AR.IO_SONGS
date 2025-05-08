# Week 2 - May 15-21, 2025 - Astro Framework Prototyping

## Current Understanding

Astro is a modern web framework that allows for a "islands architecture" approach - where most content is static HTML with isolated interactive components. This seems perfect for artist sites where we want:

1. Fast initial loading (static content)
2. Interactive audio players
3. Potentially token-gated content sections
4. Great SEO

The Astro approach lets us ship minimal JavaScript, which should keep our site payloads small for efficient Arweave storage.

## This Week's Exploration

### Setting Up Initial Astro Project

```bash
# Commands executed:
npm create astro@latest artist-site-template

# Selected options:
# - Empty project
# - TypeScript (strict)
# - Install dependencies: Yes
# - Initialize git repo: Yes
```

### Component Structure Experimentation

Tried different approaches for structuring the components:

```
/src
  /components
    /artist
      ArtistHeader.astro
      SocialLinks.astro
    /player
      AudioPlayer.jsx (React component for interactivity)
    /layout
      BaseLayout.astro
      Theme.astro
    /shared
      Button.astro
      Card.astro
```

### Data Fetching Patterns

Explored how to load artist data from JSON:

```typescript
---
// Example Astro component
import type { ArtistProfile } from '../types';

// In a real implementation, this would come from props or API
const artistData: ArtistProfile = await import('../data/artist.json');
const { name, bio, social } = artistData.artist;
---

<div class="artist-profile">
  <h1>{name}</h1>
  <p>{bio}</p>
  <!-- Social links would be rendered here -->
</div>
```

## Challenges & Breakthroughs

### Challenges
- Understanding how to properly implement token-gating with Astro's island architecture
- Determining the best approach for theming (CSS variables vs. separate builds)
- Figuring out how to handle audio streaming efficiently

### Breakthroughs
- Discovered Astro's "Content Collections" feature which could be perfect for modeling artist discographies
- Found that Astro's partial hydration allows for minimal JavaScript only where needed
- Realized we can leverage static site generation for most content, with API routes for token verification

## Next Steps

- [ ] Create core layout templates for artist sites
- [ ] Implement a basic audio player component
- [ ] Experiment with theming approaches
- [ ] Integrate with Arweave data loading patterns
- [ ] Build a sample artist page with mock data

## Code & Examples

Basic structure of a themed artist page:

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import ArtistHeader from '../components/artist/ArtistHeader.astro';
import Discography from '../components/music/Discography.astro';
import AudioPlayer from '../components/player/AudioPlayer';
import artistData from '../data/artist.json';
import tracks from '../data/tracks.json';

const theme = Astro.url.searchParams.get('theme') || 'classic';
---

<BaseLayout theme={theme} title={artistData.artist.name}>
  <ArtistHeader artist={artistData.artist} />
  
  <main>
    <Discography tracks={tracks} />
  </main>
  
  <footer>
    <AudioPlayer client:idle />
  </footer>
</BaseLayout>
``` 