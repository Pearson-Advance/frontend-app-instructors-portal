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

/**
 * Sets the time of a given date in UTC format. If no time is provided, the current time of the date is maintained.
 *
 * @param {Date | string} date - The date object or date string to modify.
 * @param {string} [timeString] - Optional time in the format 'HH:MM'. If provided, it sets the hours and minutes.
 * @returns {string} - The date in ISO string format with the time adjusted to UTC.
 */
export const setTimeInUTC = (date, timeString) => {
  const newDate = new Date(date);

  if (timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    newDate.setUTCHours(hours);
    newDate.setUTCMinutes(minutes);
    newDate.setUTCSeconds(0);
  }

  return newDate?.toISOString();
};

/**
 * Creates an event manager that ensures a callback function is executed only once every 2 seconds.
 * The callback is called with the provided event data.
 *
 * @param {Function} callback - The callback function to be executed with the event data.
 * @returns {Function} - A function that takes an event and executes the callback if it's not currently executing.
 */
export const eventManager = (callback) => {
  let isExecuting = false;
  return async (event) => {
    if (!isExecuting) {
      isExecuting = true;
      await callback(event);
      setTimeout(() => {
        isExecuting = false;
      }, 2000);
    }
  };
};
