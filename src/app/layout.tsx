import * as React from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export const metadata = {
  title: 'Next.js App Router + Material UI v5',
  description: 'Next.js App Router + Material UI v5',
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppBar position="fixed" sx={{ zIndex: 2000 }}>
          <Toolbar>
            <Typography variant="h6">
              AutoSaver
            </Typography>
          </Toolbar>
        </AppBar>

        {children}
      </body>
    </html>
  );
}
