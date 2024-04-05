// todo lo relacionado con los get
const { groupDB } = require("../database/memory");

/**
 *
 * @param string sort
 * @returns
 */
const getAll = (sort) => {
  let groupDbSorted = [];
  if (sort === "asc") {
    groupDbSorted = groupDB.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    groupDbSorted = groupDB.sort((a, b) => b.name.localeCompare(a.name));
  }
  return groupDbSorted.map((group) => ({
    name: group.name,
    color: group.color,
  }));
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
  return newGroup;
};

module.exports = {
  getAll,
  get,
  create,
};
