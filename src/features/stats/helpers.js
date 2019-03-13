// @ts-check
import { format } from 'date-fns';
import { firestore } from '../../utils/firebase';

/** @params {number}  timestamp */
export const inPast = timestamp => timestamp - Date.now() / 1000 > 0;
export const convertSecondsToDaysFrom = (seconds, startDate) =>
  Math.floor(seconds / 86400) - Math.floor(startDate / 86400);

/** @param {number} numberOfDays */
/** @param {number} startDateInSecondsFromEpoch */
/** @return{string} */
export const convertNumberToDate = (
  numberOfDays,
  startDateInSecondsFromEpoch
) => {
  const startDate = startDateInSecondsFromEpoch * 1000;
  const additionalSeconds = numberOfDays * 86400 * 1000;
  const date = format(new Date(startDate + additionalSeconds), 'd MMM yyyy');
  return date;
};

/** @param {number} startDateInSecondsFromEpoch */
/** @return{number} */
export const calculateTodayDateinDaysFromStartDate = startDateInSecondsFromEpoch => {
  const startDate = startDateInSecondsFromEpoch * 1000;
  const todaysDate = Date.now();
  const today = (todaysDate - startDate) / (86400 * 1000);
  return today - 1;
};

export const createNewGoal = async deadline => {
  const newObjective = await firestore.collection(`objectives`).doc();
  console.log('deadline', deadline);
  await firestore.doc(`objectives/${newObjective.id}`).set({
    id: newObjective.id,
    createdBy: 'JOsh',
    assignedTo: 'Josh',
    color: 'red',
    createdOn: new Date(),
    deadline: new Date('April 17, 2019'),
    details: 'new goal',
    size: '24px',
    team: 'dev123',
  });
};
