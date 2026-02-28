module.exports = (permissionName) => {
    return (req, res, next) => {
        // Admin always has all permissions
        if (req.user.role === "admin") {
            return next();
        }

        // Allow if user is hr and has the specific permission
        if (req.user.role === "hr") {
            if (req.user.hrPermissions && req.user.hrPermissions[permissionName] === true) {
                return next();
            }
            return res.status(403).json({ success: false, message: `Access denied. Requires '${permissionName}' permission.` });
        }

        // Default deny for other roles
        return res.status(403).json({ success: false, message: "Admin or authorized HR access only" });
    };
};
