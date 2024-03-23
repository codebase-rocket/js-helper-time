// Info: Configuration file
'use strict';


// Export configration as key-value Map
module.exports = {

  // Constraints on Timezone
  TIMEZONE_MIN_LENGTH       : 2,                    // Minimum length (As per IANA Format)
  TIMEZONE_MAX_LENGTH       : 50,                   // Maximum length (As per IANA Format)
  TIMEZONE_SANATIZE_REGX    : /[^0-9a-z+-_]/g,      // Regular expression for valid Characters. Case Insensitive

}
