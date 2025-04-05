const transactionReducer = (state, action) => {
    switch (action.type) {
      case 'GET_TRANSACTIONS':
        return {
          ...state,
          transactions: action.payload,
          loading: false
        };
      case 'ADD_TRANSACTION':
        return {
          ...state,
          transactions: [action.payload, ...state.transactions],
          loading: false
        };
      case 'DELETE_TRANSACTION':
        return {
          ...state,
          transactions: state.transactions.filter(
            transaction => transaction._id !== action.payload
          ),
          loading: false
        };
      case 'UPDATE_TRANSACTION':
        return {
          ...state,
          transactions: state.transactions.map(transaction =>
            transaction._id === action.payload._id ? action.payload : transaction
          ),
          loading: false
        };
      case 'GET_TAX_SUMMARY':
        return {
          ...state,
          taxSummary: action.payload,
          loading: false
        };
      case 'TRANSACTION_ERROR':
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case 'CLEAR_TRANSACTIONS':
        return {
          ...state,
          transactions: [],
          transaction: null,
          taxSummary: null,
          loading: false
        };
      default:
        return state;
    }
  };
  
  export default transactionReducer;