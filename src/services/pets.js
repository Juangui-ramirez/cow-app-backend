const { petDB, groupDB } = require('../database/memory');

 const getAll = () => {
  return petDB.map((pet) => ({ name: pet.name }));
};

/**
 * 
 * @param string name 
 * @returns 
 */
 const get = (name) => {
  //const petName = req.params.name;
  const foundPet = petDB.find(pet => pet.name === name);
  return foundPet;
  //res.json(foundPet);
};


/**
 * 
 * @param newPet of the form: {name: string, color: string, weigth: number}
 * @returns 
 */
const create = (newPet) => {
  //const pet = req.body;
  const petName = pet.name;

  //console.log("input pet", pet);

  const alreadyThere = petDB.some(pet => pet.name === petName);
  if (alreadyThere) {
    //res.status(409);
    return false;
  }
  petDB.push({
    name: newPet.name,
    color: newPet.color,
    weight: newPet.weight,
  });
 // res.status(201).json(pet);
};

module.exports = {
    getAll,
    get,
    create
}
