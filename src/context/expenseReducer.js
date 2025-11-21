/**
 * Initial state for the expense reducer
 */
export const initialState = {
  expenses: [],
  currentView: 'dashboard',
  viewData: null,
  error: null
};

/**
 * Reducer function for expense management
 */
export function expenseReducer(state, action) {
  switch (action.type) {
    case 'LOAD_EXPENSES':
      return {
        ...state,
        expenses: action.payload
      };
      
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [action.payload, ...state.expenses],
        currentView: 'dashboard',
        viewData: null,
        error: null
      };
      
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload.id),
        error: null
      };

    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense => 
          expense.id === action.payload.id 
            ? { ...expense, ...action.payload.updates }
            : expense
        ),
        currentView: 'dashboard', // Return to dashboard after update
        viewData: null,
        error: null
      };
      
    case 'SET_VIEW':
      return {
        ...state,
        currentView: action.payload.view || action.payload,
        viewData: action.payload.data || null,
        error: null
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
      
    default:
      return state;
  }
}

