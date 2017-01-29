import { NumericKeypadPage } from './app.po';

describe('numeric-keypad App', function() {
  let page: NumericKeypadPage;

  beforeEach(() => {
    page = new NumericKeypadPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
