import { config } from '../config';

const metaMapper: {
  [name: string]: string;
} = {
  description: config.siteDescription,
  keywords: config.siteKeywords,
  'apple-mobile-web-app-title': config.siteName,
};

export class MetaRewriter implements HTMLRewriterElementContentHandlers {
  element(element: Element): void {
    const name = element.getAttribute('name');
    if (name && metaMapper[name]) {
      element.setAttribute('content', metaMapper[name]);
    }
  }
}
