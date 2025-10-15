# TODO List for Student App Changes

## Task 1: Remove Group Management from Student Dashboard
- [x] Edit `client/student/src/pages/StudentDashboard.jsx` to remove the "Group Management" card from the quick actions grid.

## Task 2: Display Group/Project Details in Student Profile
- [x] Edit `client/student/src/pages/StudentProfile.jsx` to fetch group data using `studentProtectedAPI.checkGroup()`.
- [x] Add a new section in the profile details grid to display group name, project details, and member information (names and enrollment numbers).
- [x] Handle cases where the student is not in a group (display appropriate message).

## Testing
- [x] Run the student app and verify the dashboard no longer shows the Group Management card.
- [x] Navigate to the profile page and confirm group/project details are displayed correctly.
- [x] Test edge cases: student not in group, group with multiple members.
