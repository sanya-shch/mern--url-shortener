const {Router} = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');

const router = Router();

router.post(
    '/register',
    [
        check('email', 'Email incorrect').isEmail(),
        check('password', 'min length - 6 signs').isLength({min: 6})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'incorrect'
                })
            }

            const {email, password} = req.body;

            const candidate = await User.findOne({email});

            if(candidate){
                return res.status(400).json({message: 'user is present'})
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const user = new User({email, password: hashedPassword});

            await user.save();

            res.status(201).json({message: 'user created'});
        } catch (e) {
            res.status(500).json({message: 'something went wrong'})
        }
});

router.post(
    '/login',
    [
        check('email', 'Email incorrect').normalizeEmail().isEmail(),
        check('password', 'enter password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'incorrect'
                })
            }

            const {email, password} = req.body;

            const user = await User.findOne({email});

            if(!user){
                return res.status(400).json({message: 'user not found'});
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch){
                return res.status(400).json({message: 'password incorrect'});
            }

            const token = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
                {expiresIn: '1h'}
            );

            res.json({token, userId: user.id});

        } catch (e) {
            res.status(500).json({message: 'something went wrong'})
        }
});

module.exports = router;