import { body, validationResult } from 'express-validator';


//let { firstName, lastName, email, phone, password } = req.body

function signupValidation() {

    return [
        body('firstName', 'FirstName does not blank').notEmpty(),
        body('lastName', 'LastName does not blank').notEmpty(),
        body('email', 'email is invalid').isEmail(),
        body('phone', 'Phone number is invalid').notEmpty().isLength({ min: 10, max: 10 }),
        body('password', 'password is not strong').notEmpty().isStrongPassword()
    ]
}

function loginValidation() {

    return [
        body('email', 'email is invalid').isEmail(),
        body('password', 'password is missing').notEmpty(),

    ]
}


function taskNameValidation() {

    return [
        body('taskName', 'TasktName does not blank').notEmpty(),


    ]
}

function validationErrors(req, res, next) {
    const result = validationResult(req);
    if (result.isEmpty()) {
        return next();
    }

    res.status(401).send({ errors: result.array() });
}
export {
    loginValidation, validationErrors, signupValidation, taskNameValidation
}