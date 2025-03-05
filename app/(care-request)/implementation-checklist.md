# Care Request Details Screen Implementation Checklist

## Navigation & Screen Setup
- [ ] Create new `CareRequestDetailsScreen.tsx` component
- [ ] Add new screen to navigation stack (not in tabs, but in the care request flow)
- [ ] Update navigation flow from care type selection to go to details screen instead of showing popup

## Details Screen UI
- [ ] Create form layout with:
  - [ ] Title input field
  - [ ] Content/description text area
  - [ ] Submit button
  - [ ] Back button (optional)
  - [ ] Show selected care type (read-only)

## Data Flow Implementation
- [ ] Pass selected `type` from selection screen to details screen
- [ ] Collect and validate user input for `title` and `content`
- [ ] Update `CareRequestService.ts` to use dynamic values instead of test data
- [ ] Pass all data to confirmation popup

## Testing & Polish
- [ ] Test navigation flow
- [ ] Test data passing between screens
- [ ] Test API integration with dynamic data
- [ ] Add loading states during submission
- [ ] Add error handling for invalid inputs

## Notes
- Current flow: Selection → Confirmation → Submit
- New flow: Selection → Details → Confirmation → Submit
- All three data points (`type`, `title`, `content`) must be passed to the API
- Keep existing confirmation popup but update it to show user-entered details 