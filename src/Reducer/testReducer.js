const initialState = {
    // Define your initial state for reducer1 here
  };
  
  const test = (state = initialState, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return { ...state, count1: state.count1 + 1 };
      case 'DECREMENT':
        return { ...state, count1: state.count1 - 1 };
      default:
        return state;
    }
  };
  
  export default test;