const express =require('express')
const router = express.Router();
const Admin = require('../../models/admin/Auth');
const auth = require('../../middleware/admin/auth')
const gravatar = require('gravatar')
const {
    check, validationResult

} = require('express-validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


// @route       GET admin/auth
// @desc         route
// @access      Public
router.get('/', auth, async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password'); // leave password
        res.json(admin);
    } catch (error) {
        res.status(500).send('Server error');
    }
});


// @route       POST admin/auth
// @desc        Authenticate admin and get token
// @access      Public

router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password',
    'Password is required'
).exists(),
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const {
        email,
        password
    } = req.body;

    try {
        let admin = await Admin.findOne({
            email
        });

        if (!admin) {
            return res.json({
               success: false,
                message: "Invalid Credentials."
            });
        }

        // Make password matches

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
           return res.json({
                success: false,
                message: "Password does not match."
            });
        }

        const payload = {
            admin: {
                id: admin.id
            }
        }

        jwt.sign(
            payload,
            process.env.jwtAdminSecret, {
                expiresIn: 360000
            }, (err, token) => {
                if (err) throw err;
                res.json({
                    success: true,
                    message: 'Enjoy your token',
                    token: token
                });
            });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');

    }
});

// Register admin


// @route       POST api/users
// @desc        Register users
// @access      Public
router.post('/register', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({
        min: 6
    })
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        name,
        email,
        password
    } = req.body;

    try {
        let admin = await Admin.findOne({
            email
        });

        if (admin) {
            res.status(400).json({
                errors: [{
                    msg: 'Admin alredy existed'
                }]
            });
        }
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        admin = new Admin({
            name,
            email,
            avatar,
            password
        });

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password, salt);

        await admin.save();

        const payload = {
            admin: {
                id: admin.id
            }
        }

        jwt.sign(
            payload,
            process.env.jwtAdminSecret, {
                expiresIn: 360000
            }, (err, token) => {
                if (err) throw err;
                res.json({
                    token
                });
            });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');

    }
});

module.exports = router;