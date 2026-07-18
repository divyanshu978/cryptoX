import ApiError from "../utils/ApiError.js";

const authorize = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            throw new ApiError(
                403,
                "Forbidden"
            );
        }

        next();
    };
};

export default authorize;