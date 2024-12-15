# SMART_MED - Diabetes Management System

## Overview
SMART_MED is a comprehensive diabetes management system that helps track and visualize diabetes-related health information across family generations. The system provides tools for document processing, family tree visualization, and medical record management with a focus on diabetes care.

## Features
- **Patient Information Management**
  - Basic patient data collection
  - Family relationship mapping
  - Diabetes-specific health metrics tracking

- **Document Processing**
  - OCR-based text extraction from medical documents
  - Automated identification of:
    - Medication details
    - Test results
    - Doctor's recommendations
    - Treatment patterns

- **Family Tree Visualization**
  - Interactive family tree display
  - Health status indicators
  - Generational diabetes pattern tracking

- **Medical Records Management**
  - Chronological tracking of:
    - Blood sugar levels
    - HbA1c results
    - Medication changes
    - Complications
  - Historical data visualization

## Tech Stack
- **Frontend**
  - React with TypeScript
  - Tailwind CSS for styling
  - Recharts for data visualization
  - React Query for state management

- **Backend**
  - Node.js
  - Express.js
  - MongoDB for database
  - JWT for authentication

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the backend directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

## Project Structure
```
SMART_MED/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
```

## API Endpoints

### Patient Routes
- `POST /api/patients` - Register new patient
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Family Routes
- `POST /api/family/relation` - Add family relation
- `GET /api/family/tree/:patientId` - Get family tree
- `PUT /api/family/relation/:id` - Update relation
- `DELETE /api/family/relation/:id` - Delete relation

### Medical Record Routes
- `POST /api/records` - Add medical record
- `GET /api/records/:patientId` - Get patient records
- `PUT /api/records/:id` - Update record
- `DELETE /api/records/:id` - Delete record

### Document Routes
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/:patientId` - Get patient documents
- `DELETE /api/documents/:id` - Delete document

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Environment Variables
### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart_med
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## Scripts

### Backend
```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "jest"
}
```

### Frontend
```json
{
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

## Testing
- Backend tests: `cd backend && npm test`
- Frontend tests: `cd frontend && npm test`

## Deployment
1. Build the frontend:
```bash
cd frontend && npm run build
```

2. Start the production server:
```bash
cd backend && npm start
```

## Security Features
- JWT-based authentication
- Input validation
- XSS protection
- CORS configuration
- Rate limiting
- Data encryption

## Error Handling
The application implements standardized error handling:
- Custom error classes
- Error logging
- User-friendly error messages
- Validation error handling

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For support, email support@smart-med.com or open an issue in the repository.

## Acknowledgments
- Medical terminology database providers
- Open-source libraries used in the project
- Contributors and maintainers