const JWT = require("jsonwebtoken")
const createError = require("http-errors")
const { UserModel } = require("../models/users")
const { isRef } = require("@hapi/joi/lib/ref");
const fs = require("fs");
const path = require("path");
const { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = require("./constans")
const redisClient = require("./init_redis")
const { default: axios } = require("axios");

function RandomNumberGenerator() {
    return Math.floor(100000 + Math.random() * 900000)
}

async function SentSMS(mobile, code) {
    try {
        await axios.post("https://app.sms1.ir:7001/api/service/patternSend",
            {
                patternId: 64,
                recipient: mobile,
                pairs: {
                    code: code.toString()
                }
            }, {
            headers: {
                'Content-Type': "application/json",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmTXFlS2dzTFpNTkZOdU1yR3FTWXl3bnhEdys3SU41S0tnWVp4b0tmdFRZPSIsImlzcyI6Imh0dHBzOi8vc21zMS5pci8iLCJpYXQiOiIxNjQ2MzcwMTczIiwiVXNlcklkIjoiNDk4OCIsIkFjY291bnRJZCI6IjExNjQ2IiwiQyI6IncweEVIUjhlSmNUVjBwZ2dCZGZBR2c9PSIsIkQiOiI3ODYiLCJCIjoiMiIsIkEiOiI2MiIsIkUiOiI3ODYiLCJGIjoiMyIsImF1ZCI6IkFueSJ9.AgOxw4VXa7KppEh_26pjNzW7tr_0VzYocQBCwuCF4Zc"
            }
        })
    } catch (err) {
        console.log(err)
    }
}

function SignAccessToken(userId) {
    return new Promise(async (resolve, reject) => {
        const user = await UserModel.findById(userId)
        const payload = {
            mobile: user.mobile
        };
        const options = {
            expiresIn: "1d"
        };
        JWT.sign(payload, ACCESS_TOKEN_SECRET_KEY, options, (err, token) => {
            if (err) reject(createError.InternalServerError("خطای سروری"));
            resolve(token)
        })
    })
}

function SignRefreshToken(userId) {
    return new Promise(async (resolve, reject) => {
        const user = await UserModel.findById(userId)
        const payload = {
            mobile: user.mobile
        };
        const options = {
            expiresIn: "1y"
        };
        JWT.sign(payload, REFRESH_TOKEN_SECRET_KEY, options, async (err, token) => {
            if (err) reject(createError.InternalServerError("خطای سروری"));
            await redisClient.SETEX(userId.valueOf(), (365 * 24 * 60 * 60), token);
            resolve(token)
        })
    })
}

function VerifyRefreshToken(token) {
    return new Promise((resolve, reject) => {
        JWT.verify(token, REFRESH_TOKEN_SECRET_KEY, async (err, payload) => {
            if (err) reject(createError.Unauthorized("وارد حساب کاربری خود شوید"))
            const { mobile } = payload || {};
            const user = await UserModel.findOne({ mobile }, { password: 0, otp: 0 })
            if (!user) reject(createError.Unauthorized("حساب کاربری یافت نشد"))
            const refreshToken = await redisClient.get(user?._id.valueOf() || "key_default");
            if (!refreshToken) reject(createError.Unauthorized("ورود مجدد به حسابی کاربری انجام نشد"))
            if (token === refreshToken) return resolve(mobile);
            reject(createError.Unauthorized("ورود مجدد به حسابی کاربری انجام نشد"))
        })
    })
}

function deleteFileInPublic(fileAddress) {
    if (fileAddress) {
        const pathFile = path.join(__dirname, "..", "..", "public", fileAddress)
        if (fs.existsSync(pathFile)) fs.unlinkSync(pathFile)
    }
}

function ListOfImagesFromRequest(files, fileUploadPath) {
    if (files?.length > 0) {
        return ((files.map(file => path.join(fileUploadPath, file.filename))).map(item => item.replace(/\\/g, "/")))
    } else {
        return []
    }
}

module.exports = {
    RandomNumberGenerator,
    SignAccessToken,
    SignRefreshToken,
    VerifyRefreshToken,
    deleteFileInPublic,
    ListOfImagesFromRequest,
    SentSMS
}