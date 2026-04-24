import '@testing-library/jest-dom';
import { createElement } from 'react';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) =>
    createElement('a', { href }, children),
}));
