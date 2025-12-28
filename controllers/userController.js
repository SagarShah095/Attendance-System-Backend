exports.getMe = async (req, res) => {
    res.status(200).json(req.user);
};
