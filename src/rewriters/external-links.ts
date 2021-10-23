import { EXTERNAL_PREFIX } from '../constants';

export function transformExternalLinks(attributeName: string) {
  return function (element: Element): boolean {
    const link = element.getAttribute(attributeName);
    if (link) {
      const transformedLink = replaceExternalLink(link);
      element.setAttribute(attributeName, transformedLink);
    }

    return false;
  };
}

export function replaceExternalLink(stringContainsLink: string): string {
  return stringContainsLink
    .replace(/^\/\//, EXTERNAL_PREFIX)
    .replace(/https:\/\//, EXTERNAL_PREFIX);
}
