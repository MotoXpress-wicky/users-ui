import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';
import { getErrorCode, getErrorMessage } from './getErrorMessage';

// An error as axios makes it when the server answered with our shared error JSON.
const serverError = (data: unknown) =>
  new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    data,
    status: 409,
    statusText: 'Conflict',
    headers: {},
    config: {} as never,
  });

describe('getErrorMessage', () => {
  it('shows the message the server sent', () => {
    expect(getErrorMessage(serverError({ code: 'OUT_OF_STOCK', message: 'There is not enough stock.' }))).toBe('There is not enough stock.');
  });

  it('shows a calm default when the server sent no message (for example a network error)', () => {
    expect(getErrorMessage(serverError({}))).toBe('Something went wrong. Please try again.');
    expect(getErrorMessage(new AxiosError('Network Error'))).toBe('Something went wrong. Please try again.');
  });

  it('does not break on an error that is not from axios', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('An unexpected error occurred.');
    expect(getErrorMessage('text')).toBe('An unexpected error occurred.');
    expect(getErrorMessage(undefined)).toBe('An unexpected error occurred.');
  });
});

describe('getErrorCode', () => {
  it('returns the stable code of the server, so the UI can choose what to do', () => {
    expect(getErrorCode(serverError({ code: 'ACCESS_TOKEN_EXPIRED', message: 'x' }))).toBe('ACCESS_TOKEN_EXPIRED');
  });

  it('returns nothing when there is no code', () => {
    expect(getErrorCode(serverError({}))).toBeUndefined();
    expect(getErrorCode(new Error('boom'))).toBeUndefined();
  });
});
