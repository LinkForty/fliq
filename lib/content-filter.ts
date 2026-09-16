import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from 'obscenity';

/**
 * Client-side objectionable-content filter.
 *
 * Messages are end-to-end encrypted, so the server can never inspect
 * content — filtering MUST happen here, before encryption. Required by
 * App Store Guideline 1.2 (Safety - User Generated Content).
 */
const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

export function containsObjectionableContent(text: string): boolean {
  return matcher.hasMatch(text);
}
