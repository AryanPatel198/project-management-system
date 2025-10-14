# TODO for Student CRUD APIs in adminController.js

- [x] Add getAllStudents function: Fetch all students with fields name, enrollmentNumber, email, phone, division (populated with course, semester, year). Include optional filters like division, isRegistered.
- [x] Add getStudentById function: Fetch a single student by ID with the same fields and population.
- [x] Add updateStudent function: Update student details (name, email, phone, isRegistered) with validation and duplicate checks.

# TODO for StudentManagement Component Refactoring

- [x] Replace direct fetch calls with API service calls in StudentManagement.jsx
- [x] Update fetchStudents to use studentAPI.getAll with filters
- [x] Update fetchDivisions to use divisionAPI.getAll
- [x] Update fetchGroups to use groupAPI.getAll
- [x] Update handleAddStudent to use studentAPI.add
- [x] Update handleUpdateStudent to use studentAPI.update
- [x] Update handleDeleteStudent to use studentAPI.delete
- [x] Add useEffect dependencies for dynamic filtering

# TODO for Removing Add Student Button

- [ ] Remove "Add Student" button from StudentManagement.jsx header
- [ ] Remove showAddModal state variable
- [ ] Remove handleAddStudent function
- [ ] Remove Add Student Modal JSX
- [ ] Remove unused Plus import from lucide-react
