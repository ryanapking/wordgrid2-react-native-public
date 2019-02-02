import moment from 'moment';

import Parse from './client-setup';
import { challengeRemoteToLocalStorageObject } from '../cloud/utilities/functions/dataConversions';

export async function getUpcomingChallengesByDate() {
  let now = moment().toDate();

  const ChallengesObject = Parse.Object.extend("Challenges");

  let upcomingChallenges = await new Parse.Query(ChallengesObject)
    .greaterThanOrEqualTo("endDate", now)
    .find();

  let challengesByDate = {};
  upcomingChallenges.forEach( (challenge) => {
    const challengeDate = moment(challenge.get("startDate")).format("D-M-YYYY");
    challengesByDate[challengeDate] = challengeRemoteToLocalStorageObject(challenge);
  });

  console.log('upcoming challenges by date:', challengesByDate);

  return challengesByDate;
}