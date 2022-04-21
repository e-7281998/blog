import { createAction, handleActions } from 'redux-actions';

const START_ROADING = 'loading/START_LOADING';
const FINISH_LOADING = 'loading/FINISH_LOADING';

// 요청을 위한 액션 타입을 payload로 설정한다.
// ex) "sample/GET_POST"

export const startingLoading = createAction(
    START_ROADING,
    requestType => requestType,
);

export const finishLoading = createAction(
    FINISH_LOADING,
    requestType = requestType,
);

const initialState = {};

const loading = handleActions(
    {
        [START_ROADING]: (state, action) => ({
            ...state,
            [action.payload]: true,
        }),
        [FINISH_LOADING]: (state, action) => ({
            ...state,
            [action.payload]: false,
        }),
    },
    initialState,
);

export default loading;