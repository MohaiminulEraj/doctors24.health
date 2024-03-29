import User from '../models/user'
import cloudinary from 'cloudinary'
import dbConnect from '@/config/dbConnect'
import ErrorHandler from '../utils/errorHandler'
import catchAsyncErrors from '../middlewares/catchAsyncErrors'
import sendEmail from '../utils/sendEmail'
import gravatar from 'gravatar'
import normalize from 'normalize-url';
import absoluteUrl from 'next-absolute-url'
import crypto from 'crypto'

// Setting up cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// dbConnect()
// Register User => /api/auth/register
const registerUser = catchAsyncErrors(async (req, res) => {

    const { fullname, username, email, password } = req.body;
    const avatar = {
        url: normalize(
            gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            }),
            { forceHttps: true }
        )
    }

    const user = await User.create({
        fullname,
        username,
        email,
        password,
        avatar
    });

    res.status(200).json({
        success: true,
        message: 'Account Registered successfully.'
    })
})

// Current user profile => /api/me
const currentUserProfile = catchAsyncErrors(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({
        success: true,
        user
    })
})

// Update user profile => /api/me/update
const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const validateUser = false;
    const checkUser = await User.find({ username: req.body.reference_no, role: "doctor" });
    if (user) {
        user.fullname = req.body.fullname;
        user.email = req.body.email;
        if (req.body.password) user.password = req.body.password;
        user.dateofbirth = req.body.dateofbirth;
        user.gender = req.body.gender;
        user.city = req.body.city;
        user.country = req.body.country;
        user.zip = req.body.zip;
        user.phone = req.body.phone;
        user.license_no = req.body.license_no;
        user.university = req.body.university;
        user.dept_doc = req.body.dept_doc;
        if (checkUser.length > 0 && req.user.username !== req.body.reference_no || req.body.reference_no === undefined) {
            user.reference_no = req.body.reference_no;
        } else {
            return next(new ErrorHandler(`Sorry! There is no Doctor by this Username: ${req.body.reference_no}`, 404))
        }
        console.log(req.body.reference_no)
    }
    //Update avatar
    if (req.body.avatar !== '') {
        // console.log(req.body.avatar)
        console.log(user.avatar)
        const image_id = user.avatar.public_id;
        // Delete user previous image/avatar
        if (image_id !== undefined) await cloudinary.v2.uploader.destroy(image_id);

        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'careforyou/avatars',
            width: '150',
            crop: 'scale'
        })
        user.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }

    await user.save();

    res.status(200).json({
        success: true
    })
})

// Forgot password   =>   /api/password/forgot
const forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404))
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false })

    // Get origin
    const { origin } = absoluteUrl(req)

    // Create reset password url
    const resetUrl = `${origin}/account/password/reset/${resetToken}`

    const message = `Your password reset url is as follow: \n\n ${resetUrl} \n\n\ If you have not requested this email, then ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'CARE FOR YOU - Password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })


    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler(error.message, 500))
    }

})

// Reset password   =>   /api/password/reset/:token
const resetPassword = catchAsyncErrors(async (req, res, next) => {

    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.query.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    // Setup the new password
    user.password = req.body.password

    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password updated successfully'
    })

})


// Get all users   =>   /api/admin/users
const allAdminUsers = catchAsyncErrors(async (req, res) => {

    const users = await User.find();
    res.status(200).json({
        success: true,
        users,
        message: 'All Users'
    })

})


// Get user details  =>   /api/admin/users/:id
const getUserDetails = catchAsyncErrors(async (req, res) => {

    const user = await User.findById(req.query.id);

    if (!user) {
        return next(new ErrorHandler('User not found with this ID.', 400))
    }

    res.status(200).json({
        success: true,
        user
    })

})


// Update user details  =>   /api/admin/users/:id
const updateUser = catchAsyncErrors(async (req, res) => {

    const newUserData = {
        fullname: req.body.fullname,
        email: req.body.email,
        role: req.body.role,
        dateofbirth: req.body.dateofbirth,
        gender: req.body.gender,
        city: req.body.city,
        country: req.body.country,
        zip: req.body.zip,
        phone: req.body.phone,
        license_no: req.body.license_no,
        university: req.body.university,
        dept_doc: req.body.dept_doc,
        reference_no: req.body.reference_no,
    }

    const user = await User.findByIdAndUpdate(req.query.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    })

})


// Delete user    =>   /api/admin/users/:id
const deleteUser = catchAsyncErrors(async (req, res) => {

    const user = await User.findById(req.query.id);

    if (!user) {
        return next(new ErrorHandler('User not found with this ID.', 400))
    }

    // Remove avatar 
    const image_id = user.avatar.public_id;
    if (image_id) await cloudinary.v2.uploader.destroy(image_id)


    await user.remove();

    res.status(200).json({
        success: true,
        user
    })

})

export {
    registerUser,
    currentUserProfile,
    updateProfile,
    forgotPassword,
    resetPassword,
    allAdminUsers,
    getUserDetails,
    updateUser,
    deleteUser
}