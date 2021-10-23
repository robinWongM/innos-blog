import customizedCss from '../styles/customize.css';

const injectors = [customStyleInjector, fakeSlardar];

export class HeadInjector implements HTMLRewriterElementContentHandlers {
  element(element: Element): void {
    for (const injector of injectors) {
      injector(element);
    }
  }
}

function customStyleInjector(element: Element) {
  const style = `<style>${customizedCss}</style>`;
  element.append(style, {
    html: true,
  });
}

function fakeSlardar(element: Element) {
  const fakeSlardarElement = `<script id="slardar"></script>`;
  element.prepend(fakeSlardarElement, {
    html: true,
  });
}
