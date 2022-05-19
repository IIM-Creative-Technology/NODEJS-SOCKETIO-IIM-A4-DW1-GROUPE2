const user = require("../model/user")

exports.findOne = async (req, res) => {
    const id = req.user.user._id;
    await user.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Il n'y a rien qui correspond à l'id = " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Erreur lors de la recuperation de l'element avec l'id=" + id });
        });
};

exports.findAll = async (req, res) => {
    const users = await user.find({});
    res.send(users)
};
