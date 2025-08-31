# Super Institution Admin Dashboard

A comprehensive admin dashboard for Super Institution Administrators to manage their institutions, view analytics, and oversee educational operations.

## 🚀 Features

- **Authentication**: Secure login and registration for super institution admins
- **Dashboard Overview**: Key metrics and statistics at a glance
- **Institution Management**: View and manage all your institutions
- **Analytics**: Comprehensive analytics with charts and insights
- **Profile Management**: Update profile information and security settings
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (shadcn/ui)
- **Icons**: Lucide React
- **Authentication**: JWT Token-based

## 📋 Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd super-institution.admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://apisimplylearn.selflearnai.in/api/v1
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 API Integration

The dashboard integrates with the following API endpoints:

### Authentication
- **POST** `/super-admin/auth/super-admin/register-super-institution-admin` - Register new admin
- **POST** `/super-admin/auth/super-institution-admin/login` - Admin login

#### Example Login Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Super Institution Admin logged in successfully",
  "data": {
    "admin": {
      "id": "cmev688pa0000qeic4900a395",
      "email": "stephsuperadmin@example.com",
      "firstName": "steph",
      "lastName": "super admin",
      "createdAt": "2025-08-28T08:57:56.494Z",
      "updatedAt": "2025-08-28T08:57:56.494Z",
      "role": "SUPER_INSTITUTION_ADMIN",
      "isActive": true,
      "isDeleted": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Example Institutions Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Institutions fetched successfully",
  "data": {
    "data": [
      {
        "id": "cmewmtmcs0000qes5rmx1j6x3",
        "name": "Greenwood High new update",
        "type": "School",
        "affiliatedBoard": "CBSE",
        "email": "contactupdate1@greenwood.edu",
        "phone": "1230167890",
        "website": "https://gh.com",
        "yearOfEstablishment": "2000",
        "totalStudentStrength": 200,
        "address": "123 Education Lane, Knowledge City",
        "approvalStatus": "APPROVED",
        "createdAt": "2025-08-29T09:30:13.996Z",
        "updatedAt": "2025-08-29T09:30:34.328Z",
        "addedById": "cmev688pa0000qeic4900a395"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "totalPages": 1
    }
  }
}
```

#### Example Institution Stats Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Institution stats fetched successfully",
  "data": {
    "totals": {
      "students": 5,
      "quizzes": 29,
      "quizSubmissions": 16,
      "exams": 20,
      "completedExams": 12,
      "projects": 7,
      "completedProjects": 0
    },
    "breakdown": {
      "byClass": [...],
      "bySection": [...],
      "gradesWithStrength": [...],
      "sectionsWithStrength": [...]
    },
    "assigned": {
      "exams": {...},
      "quizzes": {...},
      "projects": {...}
    },
    "studentAnalytics": {...},
    "classSectionAnalytics": {...},
    "growth": {...}
  }
}
```

### Institution Management
- **GET** `/super-admin/institutions/my?page=1&limit=10` - Get admin's institutions
- **GET** `/super-admin/institutions/{id}/stats` - Get institution statistics

### Headers Required
```javascript
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

### Request Body Examples

#### Register Request
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "StrongPass123!",
  "role": "SUPER_INSTITUTION_ADMIN"
}
```

#### Login Request
```json
{
  "email": "john.doe@example.com",
  "password": "StrongPass123!"
}
```

## 🏗️ Project Structure

```
super-institution.admin/
├── app/                          # Next.js app directory
│   ├── components/              # Shared components
│   │   └── Sidebar.tsx         # Navigation sidebar
│   ├── dashboard/              # Dashboard pages
│   │   ├── institutions/       # Institution management
│   │   ├── analytics/          # Analytics and reporting
│   │   ├── profile/            # Profile management
│   │   ├── layout.tsx          # Dashboard layout
│   │   └── page.tsx            # Dashboard home
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Login/Register page
├── components/                  # Reusable UI components
│   └── ui/                     # shadcn/ui components
├── lib/                        # Utilities and configurations
│   ├── api.ts                  # API client
│   └── utils.ts                # Helper functions
├── public/                     # Static assets
└── ...config files
```

## 🔐 Authentication Flow

1. **Registration**: New admins register with name, email, password, and role
2. **Login**: Existing admins login with email and password
3. **Token Storage**: JWT tokens are stored in localStorage
4. **Protected Routes**: Dashboard routes require valid authentication
5. **Auto-redirect**: Unauthenticated users are redirected to login

## 📊 Dashboard Features

### Overview Dashboard
- Total institutions count
- Student statistics
- Growth metrics
- Recent activity feed
- Quick action buttons

### Institution Management
- List all managed institutions
- Search and filter institutions
- View detailed institution information
- Access institution-specific statistics
- Pagination support

### Analytics
- Revenue trends and growth charts
- Student enrollment analytics
- Institution performance metrics
- Monthly comparison data
- Key performance indicators

### Profile Management
- Update personal information
- Change password securely
- View account statistics
- Security recommendations

## 🎨 UI Components

Built with shadcn/ui components for consistency:
- **Cards**: Information display containers
- **Buttons**: Various button styles and sizes
- **Forms**: Input fields, labels, validation
- **Navigation**: Sidebar with responsive mobile menu
- **Toasts**: Success/error notifications
- **Loading States**: Skeleton loaders and spinners

## 🚀 Deployment

### Build for Production
```bash
npm run build
# or
yarn build
```

### Start Production Server
```bash
npm run start
# or
yarn start
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## 🔧 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for API endpoints | Yes |
| `NEXT_PUBLIC_APP_NAME` | Application name | No |
| `NEXT_PUBLIC_DEBUG` | Enable debug mode | No |

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Verify `NEXT_PUBLIC_API_BASE_URL` is correct
   - Check if API server is running
   - Ensure CORS is configured on the API

2. **Authentication Issues**
   - Clear localStorage and try logging in again
   - Check if JWT token is valid
   - Verify API endpoints are accessible

3. **Build Errors**
   - Delete `.next` folder and `node_modules`
   - Run `npm install` and `npm run build` again

## 📝 API Data Models

### Admin Profile
```typescript
interface AdminProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  role: string;
  isActive: boolean;
  isDeleted: boolean;
}
```

### Institution
```typescript
interface Institution {
  id: string;
  name: string;
  type: string;
  affiliatedBoard: string;
  email: string;
  password?: string | null;
  phone: string;
  website: string;
  yearOfEstablishment: string;
  totalStudentStrength: number;
  proofOfInstitutionUrl: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  address: string;
  approvalStatus: string;
  createdAt: string;
  updatedAt: string;
  addedById: string;
}
```

### Institution Stats
```typescript
interface InstitutionStatsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    totals: {
      students: number;
      quizzes: number;
      quizSubmissions: number;
      exams: number;
      completedExams: number;
      projects: number;
      completedProjects: number;
    };
    breakdown: any;
    assigned: any;
    studentAnalytics: any;
    classSectionAnalytics: any;
    growth: any;
  };
}
```

### Institutions Response
```typescript
interface InstitutionsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    data: Institution[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
```

### API Response Format
```typescript
interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

## 🔄 Version History

- **v1.0.0** - Initial release with core dashboard functionality
- Authentication system
- Institution management
- Analytics dashboard
- Profile management
- Responsive design

---

Built with ❤️ for educational institutions worldwide.