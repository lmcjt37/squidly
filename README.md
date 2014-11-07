#Ogle Bot
*********

#####Author: Luke Taylor
#####Version: 1.1.0

*********

This extension allows you to track users in the Appcelerator Q & A Leaderboard. Simply give it a name and it intelligently tracks the user providing all their information.

###Features
***********
- User tracking and Tracking Mode.
- Quick links to Top 100, Q&A and Docs.
- Regular 15 minute updates or refresh by button.
- Search by Name or Rank, including a filtered search.


###Launching the extension
**************************
The extension can be found in the Chrome Webstore [here](#)

This will add a launcher inside your Chrome browser, next to the Omnibox, allowing you to easily track and access this information.


###Built using:
***************
- Bootstrap
- JQuery
- Grunt
- LESS (preprocessor)
- Typeahead.js


###Future updates:
******************
- Clicking the tracked user returns how many points ahead and behind you are.


*********
Changelog
*********

##### 1.1.0
- Reduced when the app updates to when browser is opened and when you search a new user, there is also an interval which is set to every 15mins.
- Added Grunt task runner.
- Added refresh button.
- Added ability to search by rank as well as name.
- Added Typeahead.js for searchable names.

##### 0.6.2
- Minor bug fixes to view type.
- Altered some labels in options tab.

##### 0.6.1
- Updated graphics.

##### 0.5.1
- Preprocessed the CSS using LESS.
- Renamed Extension from 'Gazer App' to current.
- Removed user set refresh interval.

##### 0.4.4
- Updated Styles.
- Updated and cleaned functions.

##### 0.4.3
- Added DevLinks to the usernames.

##### 0.4.2
- Added badge and title to quickly hover and see score and rank.

##### 0.4.1
- Refactored code to use HTML templates.
- Speeded up the extensions load times.

##### 0.3.2
- Corrected hide/show of respective elements.
- Updated animations.
- Fixed minor bug with leaderboard updating.

##### 0.3.2
- Updated function calculating progress bars relative to tracked user.

##### 0.3.1
- Fixed bugs which kept crashing the scripts.

##### 0.2.1
- Updated functions to update multiple users.
- Made additional data available for each user.

##### 0.1.2
- Added option to change whether to track single or multiple user.
- Minor Funtion updates.

##### 0.1.1
- Added Bootstrap and JQuery Frameworks.
- Added helper functions.
- Minor Bug Fixes, includes fixing the remote origin request.