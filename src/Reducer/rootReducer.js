import { combineReducers } from 'redux';
import test from './testReducer';
import model from './modelReducer';

export default combineReducers({
  test,
  model
});