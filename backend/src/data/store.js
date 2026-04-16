const initialState = () => ({
  nextTaskId: 1,
  nextCommentId: 1,
  tasks: [],
  comments: [],
});

let state = initialState();

function resetStore() {
  state = initialState();
}

function getStore() {
  return state;
}

module.exports = {
  getStore,
  resetStore,
};
