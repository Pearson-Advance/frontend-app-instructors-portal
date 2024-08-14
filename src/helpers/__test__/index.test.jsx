import { emailValidationMessages } from 'helpers';

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
