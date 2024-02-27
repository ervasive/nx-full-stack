import { render } from '@testing-library/react';

import StorefrontUi from './storefront-ui';

describe('StorefrontUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StorefrontUi />);
    expect(baseElement).toBeTruthy();
  });
});
