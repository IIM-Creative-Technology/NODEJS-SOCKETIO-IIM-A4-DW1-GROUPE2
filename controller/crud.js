const crud = require("../model/crud")

exports.create = async (req, res) => {
    const image = req.files.image;
    const imgLink = 'front/public/assets/image' + image.name;
    await image.mv(imgLink)
    const create = new crud({
        title: req.body.title,
        description: req.body.description,
        image: imgLink,
    });
    create
        .save(create)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Erreur lors de la creation"
            });
        });
};

exports.findAll = (req, res) => {
    const title = req.query.title;
    let condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
    crud.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Erreur lors de la recuperation."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    crud.findById(id)
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

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "l'info a mettre a jour ne peux pas etre vide"
        });
    }
    const id = req.params.id;
    crud.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Impossible de mettre a jour l'element qui a l'id=${id}. Ce dernier ne peut pas être trouver!`
                });
            } else res.send({ message: "Element mis à jour avec succes" });
        })
        .catch(err => {
            res.status(500).send({
                message: "Erreur lors de la mise à jours de l'element correspondant à l'id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;
    crud.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Impossible de supprimer l'element qui à l'id=${id}. Element impossible à trouver!`
                });
            } else {
                res.send({
                    message: "Element supprimer avec succes!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Impossible de supprimer l'element qui à l'id=" + id
            });
        });
};
