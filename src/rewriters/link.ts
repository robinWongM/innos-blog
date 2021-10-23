import { transformExternalLinks } from './external-links';

const processors = [transformExternalLinks('href')];

export class LinkRewriter implements HTMLRewriterElementContentHandlers {
  element(element: Element): void {
    for (const processor of processors) {
      processor(element);
    }
  }
}
