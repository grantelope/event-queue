'use client'

import * as React from 'react';

import { ApolloProvider } from "@apollo/client";
import Box from '@mui/material/Box';
import { FormDemo } from '@/app/components/form';
import { client } from '@/apollo-client'

export default function HomePage() {
  return (
    <Box >
      <ApolloProvider client={client}>
        <FormDemo />
      </ApolloProvider>
    </Box>
  );
}
