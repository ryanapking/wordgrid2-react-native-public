// available actions
const SET_CHALLENGE_DATA = 'wordgrid2/gameData/SET_CHALLENGE_DATA';

const initialState = {};

// reducer manager
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_CHALLENGE_DATA:
      return action.challengeData;
    default:
      return state;
  }
}

// action creators
export function setChallengeData(challengeData) {
  return {
    type: SET_CHALLENGE_DATA,
    challengeData
  }
}