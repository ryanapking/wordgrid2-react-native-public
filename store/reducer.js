export const GET_TEST_SUCCESS = 'wordgrid2/test/LOAD_SUCCESS';
export const GET_TEST_FAIL = 'wordgrid2/test/LOAD_FAIL';

export default function reducer(state = { testData: "" }, action) {
  switch (action.type) {
    case GET_TEST_SUCCESS:
      return { ...state, testData: "Success" };
    case GET_TEST_FAIL:
      return { ...state, testData: "Fail"};
    default:
      return state;
  }
}

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