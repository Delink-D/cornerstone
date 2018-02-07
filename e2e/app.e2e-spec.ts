import { CornerstonePage } from './app.po';

describe('cornerstone App', () => {
  let page: CornerstonePage;

  beforeEach(() => {
    page = new CornerstonePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
