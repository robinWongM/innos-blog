import { config } from '../config';

export class TitleRewriter implements HTMLRewriterElementContentHandlers {
  textBuffer = '';

  text(textChunk: Text): void {
    this.textBuffer += textChunk.text;

    if (textChunk.lastInTextNode) {
      textChunk.replace(
        this.textBuffer.replace(/Innos Note$/, config.siteName),
      );
      this.textBuffer = '';

      return;
    }

    textChunk.remove();
  }
}
