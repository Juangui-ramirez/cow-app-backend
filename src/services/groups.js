// todo lo relacionado con los get
const { petDB, groupDB } = require("../database/memory");

const getAll = () => {
  return groupDB.map((group) => ({ name: group.name, color: group.color }));
};

/**
 *
 * @param string name
 * @returns
 */
const get = (name) => {
  const foundGroup = groupDB.find((group) => group.name === name);
  return foundGroup;
};

/**
 *
 * @param newGroup of the form: {name: string, color: string}
 * @returns
 */
const create = (newGroup) => {
  const groupName = newGroup.name;
  const alreadyThere = groupDB.some((group) => group.name === groupName);
  if (alreadyThere) {
    return false;
  }
  groupDB.push({
    name: newGroup.name,
    color: newGroup.color,
  });
  return true;
};

module.exports = {
  getAll,
  get,
  create,
};
