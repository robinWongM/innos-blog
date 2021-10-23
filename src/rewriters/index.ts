import { ScriptRewriter } from './script';
import { LinkRewriter } from './link';
import { HeadInjector } from './head';
import { MetaRewriter } from './meta';
import { TitleRewriter } from './title';

const htmlRewriter = new HTMLRewriter();

export function setupHtmlRewriter(): void {
  htmlRewriter.on('script', new ScriptRewriter());
  htmlRewriter.on('link', new LinkRewriter());
  htmlRewriter.on('meta', new MetaRewriter());
  htmlRewriter.on('title', new TitleRewriter());

  htmlRewriter.on('head', new HeadInjector());
}

export function transform(response: Response): Response {
  return htmlRewriter.transform(response);
}
