# Week 3 - May 22-28, 2025 - Artist Data Schema Design

## Current Understanding

For the artist site generator to work effectively, we need a standardized JSON schema that:
1. Contains all necessary artist information
2. Supports discography with track metadata
3. Links to Arweave-stored assets (images, audio)
4. Enables token-gated content identification
5. Is extensible for future features

The schema should be simple enough for artists to understand while being robust enough to support all site features.

## This Week's Exploration

### Schema Design Iterations

Started with basic artist profile structure and iterated:

```json
// Version 1 - Basic
{
  "artist": {
    "name": "Artist Name",
    "bio": "Artist bio...",
    "image": "arweave://TXID"
  },
  "tracks": []
}

// Version 2 - More detailed
{
  "artist": {
    "name": "Artist Name",
    "bio": "Artist bio...",
    "image": {
      "main": "arweave://TXID",
      "thumbnail": "arweave://TXID"
    },
    "social": {
      "twitter": "handle",
      "instagram": "handle",
      "spotify": "url"
    },
    "links": [
      { "title": "Official Website", "url": "https://..." }
    ]
  },
  "discography": [
    {
      "title": "Track Title",
      "releaseDate": "2023-01-01",
      "type": "single",
      "cover": "arweave://TXID",
      "audio": {
        "preview": "arweave://TXID",
        "fullQuality": "arweave://TXID",
        "tokenGated": true
      },
      "credits": [
        { "role": "Producer", "name": "Producer Name" }
      ],
      "lyrics": "Lyrics text..."
    }
  ]
}
```

### JSON Schema Validation

Created a JSON schema for validation:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["artist", "discography"],
  "properties": {
    "artist": {
      "type": "object",
      "required": ["name"],
      "properties": {
        "name": { "type": "string" },
        "bio": { "type": "string" },
        // ... other properties
      }
    },
    "discography": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["title"],
        "properties": {
          "title": { "type": "string" },
          // ... other properties
        }
      }
    }
  }
}
```

### ArFS Compatibility Research

Investigated how our schema aligns with ArFS (Arweave File System) standards:

```
Findings:
- ArFS uses a folder/file model similar to traditional file systems
- Each entity has a unique dataId and potentially a contentId
- Files have additional metadata like size, contentType
- Need to consider how to map our artist data model to this structure
```

## Challenges & Breakthroughs

### Challenges
- Balancing schema simplicity with comprehensiveness
- Handling relationships between artists and collaborators
- Determining how to structure token-gated content references
- Ensuring schema supports all three themes without theme-specific fields

### Breakthroughs
- Realized we can use a hybrid approach with core schema + optional extensions
- Discovered JSON Schema can help provide validation and tooling
- Found that separating display preferences from content data improves flexibility

## Next Steps

- [ ] Finalize core JSON schema with validation
- [ ] Create sample artist data files for testing
- [ ] Test schema with Astro components
- [ ] Develop schema documentation for artists
- [ ] Create migration script for existing artist data

## Code & Examples

Example of schema validation implementation:

```typescript
import Ajv from 'ajv';
import artistSchema from '../schemas/artist.json';

const ajv = new Ajv();
const validate = ajv.compile(artistSchema);

export function validateArtistData(data: unknown) {
  const valid = validate(data);
  
  if (!valid) {
    return {
      valid: false,
      errors: validate.errors
    };
  }
  
  return {
    valid: true,
    errors: null
  };
}

// Usage:
// const result = validateArtistData(artistData);
// if (!result.valid) {
//   console.error('Invalid artist data:', result.errors);
// }
``` 