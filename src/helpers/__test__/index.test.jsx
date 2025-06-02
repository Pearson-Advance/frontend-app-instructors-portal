import {
  emailValidationMessages,
  setTimeInUTC,
  eventManager,
  stringToDateType,
  isInvalidUserOrInstitution,
} from 'helpers';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

describe('emailValidationMessages', () => {
  test('Should return invalid message for one user', () => {
    const emailList = [
      {
        invalidIdentifier: true,
        identifier: '1234',
      },
    ];
    expect(emailValidationMessages(emailList)).toBe('The following email adress is invalid:\n1234\n');
  });

  test('Should return invalid message for more than one user', () => {
    const emailList = [
      {
        invalidIdentifier: true,
        identifier: '1234',
      },
      {
        invalidIdentifier: true,
        identifier: 'test',
      },
    ];
    expect(emailValidationMessages(emailList)).toBe('The following email adresses are invalid:\n1234\ntest\n');
  });

  test('Should return valid message for one user', () => {
    const emailList = [
      {
        identifier: 'student@example.com',
      },
    ];
    expect(emailValidationMessages(emailList)).toBe('Successfully enrolled and sent email to the following user:\nstudent@example.com');
  });

  test('Should return valid message for more than one user', () => {
    const emailList = [
      {
        identifier: 'student@example.com',
      },
      {
        identifier: 'example@example.com',
      },
    ];
    expect(emailValidationMessages(emailList)).toBe('Successfully enrolled and sent email to the following users:\nstudent@example.com\nexample@example.com');
  });
});

describe('setTimeInUTC', () => {
  test('Should set time correctly with provided time string', () => {
    const date = '2024-09-17T00:00:00Z';
    const timeString = '15:37';
    const result = setTimeInUTC(date, timeString);
    expect(result).toBe('2024-09-17T15:37:00.000Z');
  });

  test('Should maintain original time if no time string is provided', () => {
    const date = '2024-09-17T12:34:56Z';
    const result = setTimeInUTC(date);
    expect(result).toBe('2024-09-17T12:34:56.000Z');
  });

  test('Should handle edge case of date string input', () => {
    const date = new Date('2024-09-17');
    const timeString = '15:37';
    const result = setTimeInUTC(date, timeString);
    expect(result).toBe('2024-09-17T15:37:00.000Z');
  });
});

describe('eventManager', () => {
  jest.useFakeTimers();

  test('should execute the callback function with event data', async () => {
    const mockCallback = jest.fn();
    const manager = eventManager(mockCallback);
    const event = { type: 'click' };

    await manager(event);
    expect(mockCallback).toHaveBeenCalledWith(event);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test('should not execute the callback function more than once in 2 seconds', async () => {
    const mockCallback = jest.fn();
    const manager = eventManager(mockCallback);
    const event = { type: 'click' };

    await manager(event);
    await manager(event);

    expect(mockCallback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(2000);
    await manager(event);

    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  test('should handle multiple events sequentially with 2 seconds interval', async () => {
    const mockCallback = jest.fn();
    const manager = eventManager(mockCallback);

    const events = [{ type: 'click' }, { type: 'scroll' }];

    await manager(events[0]);
    expect(mockCallback).toHaveBeenCalledWith(events[0]);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(2000);
    await manager(events[1]);
    expect(mockCallback).toHaveBeenCalledWith(events[1]);
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });
});

describe('stringToDateType', () => {
  test('Should transform string to date', () => {
    const date = '2024-09-01';
    const result = stringToDateType(date);
    expect(result).toEqual(new Date(2024, 8, 1));
  });
});

describe('isInvalidUserOrInstitution', () => {
  test('returns true when username is missing', () => {
    expect(isInvalidUserOrInstitution('', { id: 1 })).toBe(true);
    expect(isInvalidUserOrInstitution(null, { id: 1 })).toBe(true);
    expect(isInvalidUserOrInstitution(undefined, { id: 1 })).toBe(true);
  });

  test('returns true when institution is null or undefined', () => {
    expect(isInvalidUserOrInstitution('user', null)).toBe(true);
    expect(isInvalidUserOrInstitution('user', undefined)).toBe(true);
  });

  test('returns true when institution is missing id', () => {
    expect(isInvalidUserOrInstitution('user', {})).toBe(true);
    expect(isInvalidUserOrInstitution('user', { name: 'Test' })).toBe(true);
  });

  test('returns false when username and institution with valid id are provided', () => {
    expect(isInvalidUserOrInstitution('user', { id: 1 })).toBe(false);
    expect(isInvalidUserOrInstitution('user', { id: null })).toBe(false);
  });

  test('returns false when id exists (even if null)', () => {
    expect(isInvalidUserOrInstitution('user', { id: null })).toBe(false);
  });
});
