// Info: Boilerplate library. Contains Date/Time related functions.
'use strict';

// Shared Dependencies (Managed by Loader)
var Lib = {};

// Private Dependencies - Parts of same library (Managed by Loader)
var TimeInput;
var TimeData;

// Exclusive Dependencies
var CONFIG = require('./config'); // Loader can override it with Custom-Config


/////////////////////////// Module-Loader START ////////////////////////////////

  /********************************************************************
  Load dependencies and configurations

  @param {Set} shared_libs - Reference to libraries already loaded in memory by other modules
  @param {Set} config - Custom configuration in key-value pairs

  @return nothing
  *********************************************************************/
  const loader = function(shared_libs, config){

    // Shared Dependencies (Must be loaded in memory already)
    Lib.Utils = shared_libs.Utils;
    Lib.Debug = shared_libs.Debug;

    // Override default configuration
    if( !Lib.Utils.isNullOrUndefined(config) ){
      Object.assign(CONFIG, config); // Merge custom configuration with defaults
    }

    // Private Dependencies
    TimeInput = require('./time_input')(Lib, CONFIG);
    TimeData = require('./time_data')(Lib, CONFIG);

  };

//////////////////////////// Module-Loader END /////////////////////////////////



///////////////////////////// Module Exports START /////////////////////////////
module.exports = function(shared_libs, config){

  // Run Loader
  loader(shared_libs, config);

  // Return Public Funtions of this module
  return [Time, TimeInput, TimeData];

};//////////////////////////// Module Exports END //////////////////////////////



///////////////////////////Public Functions START///////////////////////////////
var Time = { // Public functions accessible by other modules

  /********************************************************************
  Return week day name on a specific date

  @param {String} year - Year
  @param {String} month - Month
  @param {String} day - Day

  @return {String} day_name - (Enum) Week day name as string ('sunday'|'monday'|'tuesday'|'wednesday'|'thursday'|'friday'|'saturday')
  *********************************************************************/
  dayName: function(year, month, day){

    // Days of week
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    // Construct date object
    const date = new Date(Date.UTC(
      Number(year),
      Number(month) - 1, // Month Index
      Number(day)
    ));


    // Return
    return days[date.getDay()];

  },


  /********************************************************************
  Return Seconds passed since Midnight 12:00 AM

  @param {Integer|String} [hours] - (Optional) Hours Past Midnight. Default 0
  @param {Integer|String} [minutes] - (Optional) Minutes Past the Hour. Default 0
  @param {Integer|String} [seconds] - (Optional) Seconds Past the Minute. Default 0

  @return {Integer} - Epoch Time with Midnight 00:00 as Reference
  *********************************************************************/
  epochDay: function(hours, minutes, seconds){

    // Return
    return (
      ( Number( Lib.Utils.fallback(hours, 0) ) * 3600 ) +
      ( Number( Lib.Utils.fallback(minutes, 0) ) * 60 ) +
      Number( Lib.Utils.fallback(seconds, 0) )
    );

  },


  /********************************************************************
  Convert Seconds passed since Midnight 12:00 AM to Hours + Minutes + Seconds

  @param {Integer} day_in_seconds - Seconds in a day

  @return {Integer, Integer, Integer} - [ Hours, Minutes, Seconds ]
  *********************************************************************/
  reverseEpochDay: function(day_in_seconds){

    // Convert to Hours, Minutes, Seconds
    var hours = Math.floor(day_in_seconds / 3600);
    var minutes = Math.floor(day_in_seconds % 3600 / 60);
    var seconds = Math.floor(day_in_seconds % 3600 % 60);


    // Return
    return [ hours, minutes, seconds ];

  },


  /********************************************************************
  Convert Military format of time to seconds past Midnight

  @param {String} military_time - Military Format of Time in a Day ('0100' | '2330')

  @return {Integer, Integer, Integer} - [ Hours, Minutes, Seconds ]
  *********************************************************************/
  militaryTimeToSeconds: function(military_time){

    // Extract and convert Hours to Seconds
    var hours = Number( military_time.substring(0, 2) ); // Extract 23 from '2330'

    // Extract and convert Minutes to Seconds
    var mins = Number( military_time.substring(2, 4) ); // Extract 30 from '2330'


    // Return
    return Time.epochDay(
      hours,
      mins,
      0 // No Seconds
    );

  },


  /********************************************************************
  Return Unixtime in Milliseconds

  @param {Integer} unixtime - Unixtime

  @return {Integer} - unixtime_in_milliseconds
  *********************************************************************/
  getUnixTimeToMilliSeconds: function(unixtime){

    // Return
    return unixtime * 1000;

  },


  /********************************************************************
  Format Hours(24 format) and Minutes to Time in 12 Hour Format (In Local Timezone)
  for 12AM Midnight, this fn assumes 0000

  @param {Integer} hours - Hours Past Midnight (23)
  @param {Integer} minutes - Minutes Past the Hour (30)

  @return {String} - 12 Hour Formatted time. '4:30 PM'
  *********************************************************************/
  formatHourMinTo12HourTime: function(hours, minutes){

    // Convert mins to padded-string ('02' for 2 mins)
    minutes = (minutes < 10) ? ('0' + minutes) : ('' + minutes)

    // Convert hours to 12 hour format
    if( hours == 24 || hours == 0 ){ // For Midnight(24) or Midnight(0)
      return `12:${minutes} AM`
    }
    else if( hours == 12 ){ // For 12 PM
      return `12:${minutes} PM`
    }
    else if( hours < 12 ){ // For 1 to 11
      return `${hours}:${minutes} AM`
    }
    else{ // For 13 till 23
      return `${hours - 12}:${minutes} PM`
    }

  },


  /********************************************************************
  Convert Seconds since Midnight to Time in 12 Hour Format
  Note: Only returns Time. Not Date.

  @param {Integer} seconds - Store Epochtime in Seconds

  @return {String} Formatted time (10:05 AM) (For Null Seconds, returns '')
  *********************************************************************/
  secondsToTimeString: function(seconds){

    // If null or empty date, then Return empty String
    if( Lib.Utils.isEmpty(seconds) ){
      return '';
    }

    // Convert epoch seconds to ISO Date String
    var date_string = Time.unixtimeToDateString(seconds);

    // Convert ISO Date to Date-data
    var date_data = Time.dateStringToDataSet(date_string);

    // Format Time in 12 Hour Format and Return
    return Time.formatHourMinTo12HourTime(
      Number(date_data['hour']),
      Number(date_data['minute'])
    );

  },


  /********************************************************************
  Return unixtime for this day at 12:00 AM

  @param {Integer} unixtime - Seconds passed since Unix-Epoch (UTC)

  @return {Integer} - Time for this day at 12:00 AM (In Seconds)
  *********************************************************************/
  unixtimeToUnixDay: function(unixtime){

    // Convert unixtime to date object
    var date = new Date(unixtime * 1000);

    var date_at_00 = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(), // Month Index
      date.getUTCDate()
    ));


    // Return Unix for that Day at 12:00 AM (in seconds)
    return Lib.Utils.getUnixTime(date_at_00);

  },


  /********************************************************************
  Calculate Epoch Seconds with offset fix

  @param {Integer} time - Seconds passed since Epoch
  @param {Number} offset - Offset in Seconds (Can be Negative)

  @return {Integer} - New time with offset adjustment
  *********************************************************************/
  calcTimeWithOffset: function(unixtime, offset){

    // Return
    return (
      unixtime +
      offset
    );

  },


  /********************************************************************
  Get offset of a Timezone at particular Time (Supports DST)

  @param {Integer} unixtime - Seconds passed since Unix-Epoch (UTC)
  @param {String} timezone - IANA Timezone ID

  @return {Integer} - Offset in Seconds
  *********************************************************************/
  getTimezoneOffset: function(unixtime, timezone){

    // Convert Unix Time to Data Object
    var date = new Date(unixtime * 1000);


    // Define Options for Formatter (Thursday, March 12, 00:59)
    var options = {
      year: 'numeric', month: 'long', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hourCycle: 'h23',
      timeZone: timezone
    };

    // Get Date in New Timezone
    var new_date_string_parts = Intl.DateTimeFormat('en', options).formatToParts(date); // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatToParts


    // Format Date in New Timezone
    var new_date_string_data = {};
    new_date_string_parts.forEach(function(item){ // Extract Keys for Date parts
      new_date_string_data[item.type] = item.value;
    });

    // Construct Date String in specific format '01 July 2022, 02:48:15'
    var new_date_string = `${new_date_string_data.day} ${new_date_string_data.month} ${new_date_string_data.year},  ${new_date_string_data.hour}:${new_date_string_data.minute}:${new_date_string_data.second}`


    // New Time in Seconds with Error-Fix for Date Conversion
    var time_with_fix = (
      ( new Date(new_date_string) ).getTime() / 1000 - // Convert Date into Seconds (In Local Timezone)
      ( new Date().getTimezoneOffset() * 60 ) // Local Timezone Offset in Seconds
    );


    // Return Timezone Offset
    return ( time_with_fix - unixtime ); // Return Offset in Seconds

  },


  /********************************************************************
  Convert Unixtime in UTC to Unixtime in Specific Timezone

  @param {Integer} unixtime - Seconds passed since Unix-Epoch (UTC)
  @param {String} timezone - IANA Timezone Name

  @return {Integer} - New time with timezone adjustment
  *********************************************************************/
  unixtimeToTimezoneTime: function(unixtime, timezone){

    return Time.calcTimeWithOffset(
      unixtime,
      Time.getTimezoneOffset(unixtime, timezone)
    );

  },


  /********************************************************************
  Convert Unixtime in UTC to Date-Object in Specific Timezone

  @param {Integer} unixtime - Seconds passed since Unix-Epoch (UTC)
  @param {String} timezone - IANA Timezone Name

  @return {Date} - Date Object with timezone adjustment
  *********************************************************************/
  unixtimeToTimezoneDate: function(unixtime, timezone){

    return new Date(
      Time.unixtimeToTimezoneTime(unixtime, timezone) * 1000
    );

  },


  /********************************************************************
  Convert Unix time in seconds to Date Object

  @param {Integer} unixtime - Seconds passed since Unix-Epoch (Timezone Independent)

  @return {Object} date - Date Object
  *********************************************************************/
  unixtimeToDate: function(unixtime){

    // Convert date to unixtime
    return new Date(unixtime * 1000);

  },


  /********************************************************************
  Convert Date Object into Epoch Seconds

  @param {Object} date - Date Object

  @return {Integer} unixtime - Seconds passed since Unix-Epoch (Timezone UTC)
  *********************************************************************/
  dateToUnixtime: function(date){

    // Return Unix Timestamp equivalant of specific date in seconds
    return Math.floor( // Convert Milli-Seconds to Seconds
      date.getTime()/1000 // In milliseconds
    );

  },


  /********************************************************************
  Convert Unix time in seconds to ISO 8601(Extended) Date String

  @param {Integer} unixtime - Seconds passed since Unix-Epoch (Timezone Independent)

  @return {String} date_string - ISO 8601(Extended) Date String (2020-09-16T07:31:13.000Z)
  *********************************************************************/
  unixtimeToDateString: function(unixtime){

    // Convert date to unixtime
    return Time.unixtimeToDate(unixtime).toISOString();

  },


  /********************************************************************
  Convert ISO 8601(Extended) Date String into Epoch Seconds

  @param {String} date_string - ISO 8601(Extended) Date String (2020-09-16T07:31:13.000Z)

  @return {Integer} - Unixime in Seconds (1600241473)
  *********************************************************************/
  dateStringToUnixtime: function(date_string){

    // Convert date-string to unixtime in seconds
    return Lib.Utils.getUnixTime(date_string);

  },


  /********************************************************************
  Convert Unix time in seconds to ISO 8601(Extended) Date String

  @param {Integer} unixtime - Seconds passed since Unix-Epoch (Timezone Independent)

  @return {String} date_string - UTC Date String (Wed, 21 Oct 2015 07:28:00 GMT)
  *********************************************************************/
  unixtimeToUtcString: function(unixtime){

    // Convert unixtime to UTC String
    return Time.unixtimeToDate(unixtime).toUTCString();

  },


  /********************************************************************
  Convert Unix time in seconds to ISO 8601(Extended) Date String

  @param {String} date_string - UTC Date String (Wed, 21 Oct 2015 07:28:00 GMT)

  @return {Integer} unixtime - Seconds passed since Unix-Epoch (Timezone Independent)
  *********************************************************************/
  utcStringToUnixtime: function(date_string){

    // Convert UTC String to Date
    const date = new Date(date_string);

    // Convert Date to Unixtime
    return Time.dateToUnixtime(date);

  },


  /********************************************************************
  Construct Date Data Set from Year, Month, Day, hours, Minutes, Seconds

  @param {String|Integer} year - Year Portion of Date
  @param {String|Integer} month - Month Portion of Date
  @param {String|Integer} day - Day Portion of Date
  @param {String|Integer} hours - hours Portion of Date
  @param {String|Integer} minutes - Minutes Portion of Date
  @param {String|Integer} seconds - Seconds Portion of Date

  @return {Set} date_data - Date-Data as Set Object
  * @return {String} year - Year Portion of Date
  * @return {String} month - Month Portion of Date
  * @return {String} day - Day Portion of Date
  * @return {String} hours - hours Portion of Date
  * @return {String} minutes - Minutes Portion of Date
  * @return {String} seconds - Seconds Portion of Date
  *********************************************************************/
  dateDataSet: function(year, month, day, hours, minutes, seconds){

    return {
      'year': year,
      'month': month,
      'day': day,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };

  },


  /********************************************************************
  Split ISO 8601(Extended) Date String into set of Year, Month, Day, hours, Minutes, Seconds

  @param {String} date_string - ISO 8601(Extended) Date String (2020-09-16T07:31:13.000Z)

  @return {Set} date_data - Date-Data as Set Object
  * @return {String} year - Year Portion of Date
  * @return {String} month - Month Portion of Date
  * @return {String} day - Day Portion of Date
  * @return {String} hours - hours Portion of Date
  * @return {String} minutes - Minutes Portion of Date
  * @return {String} seconds - Seconds Portion of Date
  *********************************************************************/
  dateStringToDataSet: function(date_string){

    return {
      'year': date_string.substr(0, 4),
      'month': date_string.substr(5, 2),
      'day': date_string.substr(8, 2),
      'hour': date_string.substr(11, 2),
      'minute': date_string.substr(14, 2),
      'second': date_string.substr(17, 2)
    }

  },


  /********************************************************************
  Split Date into set of Year, Month, Day, hours, Minutes, Seconds

  @param {Date} date - Date Object with timezone adjustment

  @return {Set} date_data - Date-Data as Set Object
  * @return {String} year - Year Portion of Date
  * @return {String} month - Month Portion of Date
  * @return {String} day - Day Portion of Date
  * @return {String} hours - hours Portion of Date
  * @return {String} minutes - Minutes Portion of Date
  * @return {String} seconds - Seconds Portion of Date
  *********************************************************************/
  dateToDataSet: function(date){

    const date_str = date.toISOString(); // "2020-09-16T07:31:13.000Z"

    return Time.dateStringToDataSet(date_str);

  },


  /********************************************************************
  Convert a data-set of Year, Month, Day, hours, Minutes, Seconds into Date Object (in UTC)

  @param {Set} date_data - Date-Data as Set Object
  * @param {String|Integer} year - Year Portion of Date
  * @param {String|Integer} month - Month Portion of Date
  * @param {String|Integer} day - Day Portion of Date
  * @param {String|Integer} hours - hours Portion of Date
  * @param {String|Integer} minutes - Minutes Portion of Date
  * @param {String|Integer} seconds - Seconds Portion of Date

  @return {Object} date - Date Object
  *********************************************************************/
  dateDataSetToDate: function(date_data){

    // Return
    return new Date(Date.UTC(
      Number(date_data['year']),
      Number(date_data['month']) - 1, // Month Index
      Number(date_data['day']),
      Number( Lib.Utils.fallback(date_data['hours'], 0) ),
      Number( Lib.Utils.fallback(date_data['minutes'], 0) ),
      Number( Lib.Utils.fallback(date_data['seconds'], 0) )
    ));

  },


  /********************************************************************
  Convert a data-set of Year, Month, Day, hours, Minutes, Seconds into Date-ISO-String

  @param {Set} date_data - Date-Data as Set Object
  * @param {String|Integer} year - Year Portion of Date
  * @param {String|Integer} month - Month Portion of Date
  * @param {String|Integer} day - Day Portion of Date
  * @param {String|Integer} hours - hours Portion of Date
  * @param {String|Integer} minutes - Minutes Portion of Date
  * @param {String|Integer} seconds - Seconds Portion of Date

  @return {String} date_string - ISO 8601(Extended) Date String (2020-09-16T07:31:13.000Z)
  *********************************************************************/
  dateDataSetToDateString: function(date_data){

    return Time.dateDataSetToDate(date_data).toISOString(); // "2020-09-16T07:31:13.000Z"

  },


  /********************************************************************
  Convert a data-set to Unix Time (in Seconds)

  @param {Set} date_data - Date-Data as Set Object
  * @param {String|Integer} year - Year Portion of Date
  * @param {String|Integer} month - Month Portion of Date
  * @param {String|Integer} day - Day Portion of Date
  * @param {String|Integer} hours - hours Portion of Date
  * @param {String|Integer} minutes - Minutes Portion of Date
  * @param {String|Integer} seconds - Seconds Portion of Date

  @return {Integer} unixtime - Seconds passed since Unix-Epoch (Timezone Independent)
  *********************************************************************/
  dateDataSetToUnixtime: function(date_data){

    return Time.dateToUnixtime( // Convert Date Object to Unix Time
      Time.dateDataSetToDate(date_data) // Convert Date-Set to Date Object
    );

  },


  /********************************************************************
  Get last day of specific month. Example 12/2026 -> 31
  Ref: https://stackoverflow.com/a/222439/1449954

  @param {String|Integer} year - Year Portion of Date
  @param {String|Integer} month - Month Portion of Date

  @return {String} day - Last day for specified month/year
  *********************************************************************/
  getLastDayOfMonth: function(year, month){

    // Create Date Set with 0 day
    var date_set = Time.dateDataSet(
      year,
      month + 1, // Increment Month to Next Month
      0 // Use 0 as the last day of the previous month. ECMA-262
    );


    // Convert Date Set to Date Object
    var date = Time.dateDataSetToDate(date_set);


    // Return Day from Date Object
    return Time.dateToDataSet(date).day;

  },

}; // Close Public Functions

////////////////////////////Public Functions END////////////////////////////////



//////////////////////////Private Functions START///////////////////////////////
const _Time = { // Private functions accessible within this modules only
  // None
};/////////////////////////Private Functions END////////////////////////////////
