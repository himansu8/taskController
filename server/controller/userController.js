import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from "jsonwebtoken" 
import config from '../config/config.js';

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


export const login = async (req, res) => {
    try {
        var { email, password } = req.body;

        // duplicate the email and phone
        let emailFound = await userModel.findOne({ email: email });
        if (!emailFound) {
            return res.status(401).json({ error: 'Incorrect email id' })
        }
        let matchPassword = await bcrypt.compare(password, emailFound.password);
        if (!matchPassword) {
            return res.status(401).json({ error: 'Incorrect password' })
        }

        const token = jwt.sign(
            { user_id: emailFound._id },
            config.PRIVATE_KEY
        );
        var { password, ...otherDetails } = emailFound._doc;
        res.status(200).json({ msg: 'user login successfully', token, details: { ...otherDetails } });

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'something went wrong' });
    }
}