Basic spec for the mobile app
We want the mobile app top focus on the doctor-patient interactions shown in the walkthrough videos. Other features like displaying benefits information are less important for this initial build, but we do list some below in case you're feeling ambitious.

Some features can be built entirely in the client by interacting with existing APIs. Others may require some work on the server side, within origami_claims in particular.

Rough outline
The basics
User log in/out
PIN and/or FaceID lock (this is very important for regulatory reasons)
List of care requests for member
Doctor / Patient Chat
Basic message sending / receiving
Images / attachments
Questionnaire UI
Threaded referral messaging UI
"Activities" list, similar to the Web UI
"Consent to treat" agreement (mention in video)
Insurance / benefits features (will require you to build out some API endpoints in origami_claims; less important)
Display information about the member's current medical plan
View digital insurance card (see member dashboard for an example, click "View ID Card")
Display deductible / out-of-pocket max
View medical claims history
Nice to have, but will require some server-side work
Password reset
If you build a working app with 1 and 2 we will be thrilled.