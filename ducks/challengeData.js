import { challengeRemoteToLocal } from "../utilities";

// available actions
const SET_SOURCE_CHALLENGE_DATA = 'wordgrid2/gameData/SET_SOURCE_CHALLENGE_DATA';
const SET_LOCAL_CHALLENGE_DATA = 'wordgrid2/gameData/SET_LOCAL_CHALLENGE_DATA';

const initialState = {
  source: null,
  challenge: null,
};

// reducer manager
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_SOURCE_CHALLENGE_DATA:
      return { ...state, source: action.sourceChallengeData };
    case SET_LOCAL_CHALLENGE_DATA:
      return { ...state, challenge: action.challenge }
    default:
      return state;
  }
}

// action creators
export function setSourceChallengeData(sourceChallengeData) {
  return {
    type: SET_SOURCE_CHALLENGE_DATA,
    sourceChallengeData,
  };
}

export function setLocalChallengeData(sourceChallengeData) {
  return {
    type: SET_LOCAL_CHALLENGE_DATA,
    challenge: challengeRemoteToLocal(sourceChallengeData),
  };
}

export function startChallenge() {
  return (dispatch, getState) => {
    const { challengeData } = getState();
    if (challengeData.source) {
      dispatch(setLocalChallengeData(challengeData.source));
    }
  };
}