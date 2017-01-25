import { TvRemoteControlPage } from './app.po';

describe('tv-remote-control App', function() {
  let page: TvRemoteControlPage;

  beforeEach(() => {
    page = new TvRemoteControlPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
