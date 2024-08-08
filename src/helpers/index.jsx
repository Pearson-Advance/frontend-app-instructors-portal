/**
 * Email validation messages for enrollment students.
 *
 * @param {Array} emailList - The array of emails.
 *
 * @returns {string} - The emvail validation message
 */
export const emailValidationMessages = (emailList) => {
  const validEmails = [];
  const invalidEmails = [];
  let message = '';

  emailList.forEach(({ invalidIdentifier, identifier }) => {
    (invalidIdentifier ? invalidEmails : validEmails).push(identifier);
  });

  if (invalidEmails.length > 0) {
    message = `The following email ${invalidEmails.length === 1
      ? 'adress is invalid'
      : 'adresses are invalid'}:\n${invalidEmails.join('\n')}\n`;
  }
  if (validEmails.length > 0) {
    message += `Successfully enrolled and sent email to the following ${validEmails.length === 1
      ? 'user'
      : 'users'}:\n${validEmails.join('\n')}`;
  }

  return message;
};
