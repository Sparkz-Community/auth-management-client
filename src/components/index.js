// AuthManagement
import changePassword from './authManagement/changePassword/changePassword';
import resetPassword from './authManagement/resetPassword/resetPassword';
import verifyAndSetPassword from './authManagement/verifyAndSetPassword/verifyAndSetPassword';
import verifyEmail from './authManagement/verifyEmail/verifyEmail';

// forgotPassword
import forgotPassword from './forgotPassword/forgotPassword';

// Login
import login from './login/baseLogin/login';
import OAuthLoginForm from './login/OAuthLoginForm/OAuthLoginForm';

// OAuthLinks
import OAuthLinks from './OAuthLinks/OAuthLinks';

// Register
import register from './register/baseRegister/register';
import OAuthRegisterForm from './register/OAuthRegisterForm/OAuthRegisterForm';
import registerPasswordLater from './register/registerPasswordLater/registerPasswordLater';

export {
  // AuthManagement
  changePassword,
  resetPassword,
  verifyAndSetPassword,
  verifyEmail,

  // forgotPassword
  forgotPassword,

  // Login
  login,
  OAuthLoginForm,

  // OAuthLinks
  OAuthLinks,

  // Register
  register,
  OAuthRegisterForm,
  registerPasswordLater,
};
