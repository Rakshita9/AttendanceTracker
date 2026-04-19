const requestLogger = (req, res, next) => {
    console.log(`${req.method} ${req.path} - Origin: ${req.get("origin")}`);
    next();
};

export default requestLogger;
