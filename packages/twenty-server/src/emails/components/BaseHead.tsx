import { Font, Head } from '@react-email/components';
import * as React from 'react';

import { emailTheme } from 'src/emails/common-style';

export const BaseHead = () => {
  return (
    <Head>
      <title>Twenty email</title>
      <Font
        fontFamily="Inter"
        fallbackFontFamily="sans-serif"
        webFont={{
          url: 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap',
          format: 'woff2',
        }}
        fontStyle="normal"
        fontWeight={emailTheme.font.weight.regular}
        fontColor={emailTheme.font.colors.primary}
      />
    </Head>
  );
};
