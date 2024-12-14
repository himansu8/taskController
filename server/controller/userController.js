import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';

export const signup = async (req, res) => {
    try {
        let { firstName, lastName, email, phone, password } = req.body


       
        let emailFound = await userModel.findOne({ email: email });
        if (emailFound) {
            return res.status(409).json({ error: 'user email already registered' })
        }

        let phoneFound = await userModel.findOne({ phone: phone });
        if (phoneFound) {
            return res.status(409).json({ error: 'user phone already registered' })
        }


        // hassing the password
        password = await bcrypt.hash(password, 12)

        let userData = {
            firstName,
            lastName,
            email,
            phone,
            password,

        }
        await userModel.create(userData);



        res.status(200).json({ msg: 'user signup sucessfull' });

    } catch (error) {
        res.status(500).json({ error: 'something went wrong' });
    }

}