export const peerReducer = (state, action) => {
  switch (action.type) {
    case "ADD_PEER":
      return {
        ...state,
        [action.payload.peerId]: {
          stream: action.payload.stream,
        },
      };
    case "REMOVE_PEERS": {
      const { peerId } = action.payload;
      const newState = { ...state };
      delete newState[peerId];
      return newState;
    }
    default:
      return state;
  }
};
