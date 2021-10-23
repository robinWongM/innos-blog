import { replaceExternalLink, transformExternalLinks } from './external-links';
import { config } from '../config';

type ElementProcessor = (element: Element) => boolean;
type TextChunkProcessor = (content: string) => string;

const elementProcessors: ElementProcessor[] = [
  removeTea,
  removeSlardar,
  fakeI18n,
  transformExternalLinks('src'),
];

const textChunkProcessors: TextChunkProcessor[] = [
  removeServiceWorker,
  removeSlardarContent,
  overwritePublicPath,
];

export class ScriptRewriter implements HTMLRewriterElementContentHandlers {
  textBuffer = '';
  textChunkNeedRemoval = false;

  element(element: Element): void {
    for (const processor of elementProcessors) {
      const processed = processor(element);
      if (processed) {
        break;
      }
    }
  }

  text(textChunk: Text): void {
    this.textBuffer += textChunk.text;

    if (textChunk.lastInTextNode) {
      for (const processor of textChunkProcessors) {
        this.textBuffer = processor(this.textBuffer);
        if (this.textBuffer === '') {
          break;
        }
      }

      textChunk.replace(this.textBuffer, {
        html: true,
      });
      this.textBuffer = '';

      return;
    }

    textChunk.remove();
  }
}

function removeServiceWorker(scriptContent: string) {
  if (scriptContent?.includes('serviceWorker')) {
    return '';
  }

  return scriptContent;
}

function removeTea(element: Element) {
  const scriptURL = element.getAttribute('src');
  if (scriptURL?.includes('tea')) {
    element.remove();
    return true;
  }

  return false;
}

function removeSlardar(element: Element) {
  const scriptURL = element.getAttribute('src');
  if (scriptURL?.includes('slardar')) {
    element.remove();
    return true;
  }

  return false;
}

function removeSlardarContent(scriptContent: string) {
  if (scriptContent?.includes('Slardar')) {
    return '';
  }

  return scriptContent;
}

function overwritePublicPath(scriptContent: string) {
  if (scriptContent?.startsWith('window.publicPath')) {
    return replaceExternalLink(scriptContent);
  }

  return scriptContent;
}

function fakeI18n(element: Element) {
  if (element.getAttribute('src')?.includes('/main.')) {
    const fakeI18nScript = `<script>
      window.TTI18N = {
        ...window.TTI18N,
        'common.appname': '${config.siteName}',
        'common.appname_oversea': '${config.siteName}',
      };
    </script>`;
    element.before(fakeI18nScript, {
      html: true,
    });
  }

  return false;
}
