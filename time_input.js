// Info: Contains Functions Related to Time Cleanup and Validations
'use strict';

// Shared Dependencies (Managed by Main Entry Module & Loader)
var Lib;

// Exclusive Dependencies
var CONFIG; // (Managed by Main Entry Module & Loader)


/////////////////////////// Module-Loader START ////////////////////////////////

  /********************************************************************
  Load dependencies and configurations

  @param {Set} shared_libs - Reference to libraries already loaded in memory by other modules
  @param {Set} config - Custom configuration in key-value pairs

  @return nothing
  *********************************************************************/
  const loader = function(shared_libs, config){

    // Shared Dependencies (Managed my Main Entry Module)
    Lib = shared_libs;

    // Configuration (Managed my Main Entry Module)
    CONFIG = config;

  };

//////////////////////////// Module-Loader END /////////////////////////////////



//////////////////////////////Module Exports START//////////////////////////////
module.exports = function(shared_libs, config){

  // Run Loader
  loader(shared_libs, config);

  // Return Public Funtions of this module
  return TimeInput;

};/////////////////////////////Module Exports END///////////////////////////////



///////////////////////////Public Functions START///////////////////////////////
const TimeInput = { // Public functions accessible by other modules

  /********************************************************************
  Rounded-off Trailing decimals in latitude (Value in Radians)

  @param {String} timezone - IANA Timezone Name

  @return {String} - Sanitized string
  *********************************************************************/
  sanitizeTimezone: function(timezone){

    // Clean and return
    return Lib.Utils.sanitizeUsingRegx(timezone, CONFIG.TIMEZONE_SANATIZE_REGX);

  },


  /********************************************************************
  Check if Valid IANA Timezone Name

  @param {String} timezone - IANA Timezone Name

  @return {Boolean} - true on success
  @return {Boolean} - false if validation fails
  *********************************************************************/
  validateTimezone: function(timezone){

    // Check if Param in within Minimum and Maximum string length
    if(
      !Lib.Utils.validateString(
        timezone,
        CONFIG.TIMEZONE_MIN_LENGTH,    // Minimum Required length
        CONFIG.TIMEZONE_MAX_LENGTH     // Maximum Allowed length
      )
    ){
      return false
    }


    // Check if 'Intl' is available
    if( !Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone ){
      throw 'Time zones are not available in this environment';
    }

    // Check if Invaild timezone
    try {
      Intl.DateTimeFormat( void 0, {timeZone: timezone} );
      return true;
    }
    catch(ex){
      return false;
    }

  },


  /********************************************************************
  Check if Valid Seconds in a Day

  @param {Integer} hours - Hours

  @return {Boolean} - true on success
  @return {Boolean} - false if validation fails
  *********************************************************************/
  validateSecondsInDay: function(seconds){

    // Check if Integer-Value in within Minimum and Maximum Integer Value or is integer
    return Lib.Utils.validateNumber(
      seconds,
      0, // Min Acceptable Value
      86400 // Max Acceptable Value
    );

  },


  /********************************************************************
  Check if Valid Minutes in a Day

  @param {Integer} minutes - Minutes in a Day

  @return {Boolean} - true on success
  @return {Boolean} - false if validation fails
  *********************************************************************/
  validateMinutesInDay: function(minutes){

    // Check if Integer-Value in within Minimum and Maximum Integer Value or is integer
    return Lib.Utils.validateNumber(
      minutes,
      0, // Min Acceptable Value
      1440 // Max Acceptable Value
    );

  },


  /********************************************************************
  Check if Valid Hours in a Day

  @param {Integer} hours - Hours

  @return {Boolean} - true on success
  @return {Boolean} - false if validation fails
  *********************************************************************/
  validateHoursInDay: function(hours){

    // Check if Integer-Value in within Minimum and Maximum Integer Value or is integer
    return Lib.Utils.validateNumber(
      hours,
      0, // Min Acceptable Value
      23 // Max Acceptable Value
    );

  },


  /********************************************************************
  Check if Valid Minutes in an Hour

  @param {Integer} minutes - Minutes

  @return {Boolean} - true on success
  @return {Boolean} - false if validation fails
  *********************************************************************/
  validateMinutesInHour: function(minutes){

    // Check if Integer-Value in within Minimum and Maximum Integer Value or is integer
    return Lib.Utils.validateNumber(
      minutes,
      0, // Min Acceptable Value
      59 // Max Acceptable Value
    );

  },


  /********************************************************************
  Check if Valid Seconds in a Minute

  @param {Integer} seconds - Seconds

  @return {Boolean} - true on success
  @return {Boolean} - false if validation fails
  *********************************************************************/
  validateSecondsInMinute: function(seconds){

    // Check if Integer-Value in within Minimum and Maximum Integer Value or is integer
    return Lib.Utils.validateNumber(
      seconds,
      0, // Min Acceptable Value
      59 // Max Acceptable Value
    );

  },


  /********************************************************************
  Check if Date Data is within Range

  @param {Integer} year - Year
  @param {Integer} month - Year
  @param {Integer} day - Year
  @param {Object} [min_date] - (Optional) Range Start. Date Object (Inclusive)
  @param {Object} [max_date] - (Optional) Range End. Date Object (Inclusive)

  @return {Boolean} - true on success
  @return {Boolean} - false if validation fails
  *********************************************************************/
  validateDateRange: function(year, month, day, min_date, max_date){

    // Construct Date Object from Year + Month Index + day
    const date = new Date(year, month-1, day);

    // Check if Date is within range
    return (
      (!min_date || date >= min_date) && // Min is Optional
      (!max_date || date <= max_date) // Max is Optional
    );

  },


  /********************************************************************
  Check if Date & Time Data is within Range

  @param {String|Integer} year - Year Portion of Date
  @param {String|Integer} month - Month Portion of Date
  @param {String|Integer} day - Day Portion of Date
  @param {String|Integer} hours - hours Portion of Date
  @param {String|Integer} minutes - Minutes Portion of Date
  @param {String|Integer} seconds - Seconds Portion of Date
  @param {Object} [min_date] - (Optional) Range Start. Date Object (Inclusive)
  @param {Object} [max_date] - (Optional) Range End. Date Object (Inclusive)

  @return {Boolean} - true on success
  @return {Boolean} - false if validation fails
  *********************************************************************/
  validateDateTimeRange: function(year, month, day, hours, minutes, seconds, min_date, max_date){

    // Construct Date Object from Year + Month Index + Day + hours + minutes + seconds
    const date = new Date(year, month-1, day, hours, minutes, seconds);

    // Check if Date is within range
    return (
      (!min_date || date >= min_date) &&
      (!max_date || date <= max_date)
    );

  },

};///////////////////////////Public Functions END//////////////////////////////



//////////////////////////Private Functions START///////////////////////////////
const _TimeInput = {  // Private methods accessible within this modules only
  // None
};/////////////////////////Private Functions END////////////////////////////////
