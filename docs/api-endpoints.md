# Origami Claims Mobile App API Endpoints

## Authentication Mechanism

The system uses a **token-based authentication** approach with a two-token system:

1. **Primary Authentication Token:**
   - Created when users log in through the `SessionsController#create` method
   - Sent in the `Authorization` header for subsequent requests
   - Obtained from the `/member_portal/api/session` endpoint
   - Destroyed on logout via `DELETE /member_portal/api/session`

2. **Care Platform Token:**
   - Obtained via the `/member_portal/api/care_requests/get_token` endpoint
   - This is a separate token specifically for Care Platform API calls
   - Has a 15-minute expiration (`expires_at: Time.now.to_i + 15.minutes.to_i`)
   - Required for all direct calls to `/patient_api/` endpoints
   - Mobile app should implement automatic refresh logic to handle expiration

### Authentication Flow:
1. User authenticates with Origami Claims to get the primary token
2. App uses that token to request a Care Platform token
3. App uses the Care Platform token for all subsequent `/patient_api/` calls

## Authentication and Session Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/member_portal/api/session` | Authenticate with Origami claims |
| DELETE | `/member_portal/api/session` | Logout |
| GET | `/member_portal/api/care_requests/get_token` | Get care platform tokens |

## Care Platform Direct Communication Endpoints

Once you have the token, you'll make direct calls to these endpoints:

### Care Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patient_api/care_requests` | List all care requests |
| GET | `/patient_api/care_requests/{id}` | Get specific care request details |
| POST | `/patient_api/care_requests` | Create a new care request |

### Messaging

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patient_api/conversations/{careRequestId}/messages` | Get messages |
| POST | `/patient_api/conversations/{careRequestId}/messages` | Send messages (including attachments) |

### Questionnaires

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patient_api/questionnaires` | Get available questionnaires |
| GET | `/patient_api/questionnaires/{id}` | Get specific questionnaire |
| POST | `/patient_api/questionnaires/{id}/submissions` | Submit completed questionnaire |

### Referrals

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patient_api/referrals` | Get referrals list |
| GET | `/patient_api/referrals/{id}` | Get specific referral |
| POST | `/patient_api/referrals/{id}/messages` | Send messages about referrals |

### Activities/Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patient_api/activities` | Get list of recent activities |

### Consent

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patient_api/consent-forms` | Get consent forms |
| POST | `/patient_api/consent-forms/{id}/signatures` | Submit signed consent 