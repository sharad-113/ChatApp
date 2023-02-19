const users = [];

// Join user to chat

function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

// Get the current user
function getCurrentUser(id) {
  return users.find((user) => {
    return user.id === id;
  });
}

// User leaves chat

function userLeave(id) {
  const index = users.findIndex((user) => {
    return user.id === id;
  });
  if (index !== -1) {
    const currUser = users[index];
    users.splice(index, 1);
    return currUser;
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
