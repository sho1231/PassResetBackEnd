const joi = require('joi');

module.exports = {
    user_signup: joi.object({
        username: joi.string().min(3).required(),
        email: joi.string().email().required(),
        pass: joi.string().min(5).required(),
        cpass: joi.ref('pass')
    }),
    user_signin: joi.object({
        email: joi.string().email().required(),
        pass: joi.string().min(5).required(),
    }),
    async isError(schema, data) {
        try {
            // console.log(schema.validateAsync(data));
            await schema.validateAsync(data);
            return false;
        }
        catch ({ details: [error] }) {
            // console.log(err);
            console.log("Error from schema.js", error);
            return error.message;
        }
    }
}
