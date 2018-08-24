// available actions
export const GET_TEST_SUCCESS = 'wordgrid2/test/LOAD_SUCCESS';
export const GET_TEST_FAIL = 'wordgrid2/test/LOAD_FAIL';

// initial state
const initialState = {
  testData: ""
}

// reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_TEST_SUCCESS:
      return { ...state, testData: "Success" };
    case GET_TEST_FAIL:
      return { ...state, testData: "Fail"};
    default:
      return state;
  }
}

// action creators
export function successTest() {
  return {
    type: GET_TEST_SUCCESS,
  };
}

export function failTest() {
  return {
    type: GET_TEST_FAIL,
  };
}