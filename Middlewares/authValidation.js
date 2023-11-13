const {body} = require("express-validator");
const errorExpressValidatorHandler = require("../ErrorHandler/errorExpressValidatorHandler");
const userModel = require("../Models/userModel");
const roleModel = require("../Models/roleModel");

const allowedMobilePhones = ['am-AM' , 'ar-AE' , 'ar-BH' , 'ar-DZ' , 'ar-EG' , 'ar-EH' , 'ar-IQ' , 'ar-JO' , 'ar-KW' , 'ar-LB' , 'ar-LY' , 'ar-MA' , 'ar-OM' , 'ar-PS' , 'ar-SA' , 'ar-SY' , 'ar-TN' , 'ar-YE' , 'az-AZ' , 'be-BY' , 'bg-BG' , 'bn-BD' , 'bs-BA' , 'cs-CZ' , 'de-AT' , 'de-CH' , 'de-DE' , 'de-LU' , 'da-DK' , 'dv-MV' , 'dz-BT' , 'el-CY' , 'el-GR' , 'en-AG' , 'en-AI' , 'en-AU' , 'en-BM' , 'en-BS' , 'en-BW' , 'en-CA' , 'en-GB' , 'en-GG' , 'en-GH' , 'en-GY' , 'en-HK' , 'en-HN' , 'en-IE' , 'en-IN' , 'en-JM' , 'en-KE' , 'en-KI' , 'en-KN' , 'en-LS' , 'en-MT' , 'en-MU' , 'en-NA' , 'en-NG' , 'en-NZ' , 'en-PG' , 'en-PH' , 'en-PK' , 'en-RW' , 'en-SG' , 'en-SL' , 'en-SS' , 'en-TZ' , 'en-UG' , 'en-US' , 'en-ZA' , 'en-ZM' , 'en-ZW' , 'es-AR' , 'es-BO' , 'es-CL' , 'es-CO' , 'es-CR' , 'es-CU' , 'es-DO' , 'es-EC' , 'es-ES' , 'es-HN' , 'es-MX' , 'es-NI' , 'es-PA' , 'es-PE' , 'es-PY' , 'es-SV' , 'es-UY' , 'es-VE' , 'et-EE' , 'fa-AF' , 'fa-IR' , 'fi-FI' , 'fj-FJ' , 'fo-FO' , 'fr-BE' , 'fr-BF' , 'fr-BJ' , 'fr-CD' , 'fr-CH' , 'fr-CM' , 'fr-FR' , 'fr-GF' , 'fr-GP' , 'fr-MQ' , 'fr-PF' , 'fr-RE' , 'ga-IE' , 'he-IL' , 'hu-HU' , 'id-ID' , 'ir-IR' , 'it-CH' , 'it-IT' , 'it-SM' , 'ja-JP' , 'ka-GE' , 'kk-KZ' , 'kl-GL' , 'ko-KR' , 'ky-KG' , 'lt-LT' , 'lv-LV' , 'mg-MG' , 'mn-MN' , 'ms-MY' , 'my-MM' , 'mz-MZ' , 'nb-NO' , 'nl-AW' , 'nl-BE' , 'nl-NL' , 'ne-NP' , 'nn-NO' , 'pl-PL' , 'pt-AO' , 'pt-BR' , 'pt-PT' , 'ro-MD' , 'ro-RO' , 'ru-RU' , 'si-LK' , 'sk-SK' , 'sl-SI' , 'sq-AL' , 'sr-RS' , 'sv-SE' , 'tg-TJ' , 'th-TH' , 'tk-TM' , 'tr-TR' , 'uk-UA' , 'uz-Uz' , 'vi-VN' , 'zh-CN' , 'zh-HK' , 'zh-TW'];

exports.signupValidation = [
	body("firstName")
		.notEmpty().withMessage("Firstname is required")
		.isString().withMessage("Firstname must be string")
		.isLength({min: 3}).withMessage("Too short Firstname, 3 characters at least")
		.isLength({max: 32}).withMessage("Too long Firstname, 32 characters at most"),
	
	body("lastName")
		.notEmpty().withMessage("Lastname is required")
		.isString().withMessage("Lastname must be string")
		.isLength({min: 3}).withMessage("Too short Lastname, 3 characters at least")
		.isLength({max: 32}).withMessage("Too long Lastname, 32 characters at most"),

	body("email")
		.notEmpty().withMessage("Email is required")
		.isEmail().withMessage("Invalid email")
		.custom(async value => {
			const user = await userModel.findOne({ email: value}, {_id: 1});
			if(user) {
				throw new Error("This email is already exist");
			}	
			return true
		}),

    body("password")
		.notEmpty().withMessage("Password is required")
		.matches(/^(?=.*[!@#$%^&*()])(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/).withMessage("Password must contain upper, lower characters, numbers and special characters"),
    
	body("mobilePhone")
		.notEmpty().withMessage("Mobile phone is required")
		.isMobilePhone(allowedMobilePhones).withMessage("Invalid Mobile Phone")
		.custom(async value => {
			const isMobilePhoneExists = await userModel.findOne({mobilePhone: value});
			if(isMobilePhoneExists) {
				throw new Error('This mobile phone number already exists');
			}
			return true;
		}),

	body("whatsAPP")
		.notEmpty().withMessage("whatsAPP number is required")
		.isMobilePhone(allowedMobilePhones).withMessage("Invalid WhatsApp number")
		.custom(async value => {
			const isWhatsAppExists = await userModel.findOne({whatsAPP: value});
			if(isWhatsAppExists) {
				throw new Error('This whatsApp number already exists');
			}
			return true;
		}),

	body("registerFriendCode")
		.optional()
		.isString("Register friend code must be string")
		.isLength({min: 4, max: 4}).withMessage("Register friend code must be 4 characters")
		.matches(/^[A-Za-z0-9]+$/).withMessage("Register friend code must contain numbers or strings only"),

	body("timeZone")
		.notEmpty().withMessage('Timezone is required')
		.isString().withMessage("Register time zone must be a string"),
	
	body("profileImage")
		.optional()
		.isURL().withMessage("Invalid Photo"),

	body("role")
		.notEmpty().withMessage("Any user must have a role")
		.isInt().withMessage("Invalid Role")
		.custom((value) => {
			const role = roleModel.findById(value, {_id: 1});
			if(role) {
				return true;
			}
			throw new Error(`This role doesn't exist`);
		}),

	errorExpressValidatorHandler
];

exports.loginValidation = [
	body("email")
		.notEmpty().withMessage("Email is required")
		.matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/).withMessage("Invalid email"),

    body("password")
		.notEmpty().withMessage("Password is required"),

	errorExpressValidatorHandler
]

exports.forgetPasswordValidation = [
	body("email")
		.notEmpty().withMessage("Email is required")
		.matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/).withMessage("Invalid email"),

	errorExpressValidatorHandler
]

exports.verifyResetPasswordCodeValidation = [
	body("email")
		.notEmpty().withMessage("Email is required")
		.matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/).withMessage("Invalid email"),

	body("code")
		.notEmpty().withMessage("Reset Code is required")
		.isInt().withMessage("Reset Code must be an integer number")
		.custom(value => {
			if(value.toString().length !== 6) {
				throw new Error("Invalid code")
			}
			return true
		}),

	errorExpressValidatorHandler
]

exports.resetPasswordValidation = [
	body("email")
		.notEmpty().withMessage("Email is required")
		.matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/).withMessage("Invalid email"),

	body("newPassword")
		.notEmpty().withMessage("New Password is required")
		.matches(/^(?=.*[!@#$%^&*()])(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/).withMessage("Password must contain upper, lower characters, numbers and special characters"),

	errorExpressValidatorHandler
]