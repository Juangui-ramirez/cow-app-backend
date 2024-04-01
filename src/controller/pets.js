const petService = require("../services/pets");

const getAll = (req, res) => {
  const pets = petService.getAll();
  res.json(pets);
};

const get = (req, res) => {
  const petName = req.params.name;
  const pet = petService.get(petName);

  if (!pet) {
    res.status(404);
    return;
  }
  res.status(200).json(pet);
};

const create = (req, res) => {
    const newPet = req.body;
    const createdPet = petService.create(newPet);
    res.status(201).json(createdPet)
};

module.exports = {
  getAll,
  get,
  create
};
