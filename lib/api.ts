const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://apisimplylearn.selflearnai.in/api/v1";

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "SUPER_INSTITUTION_ADMIN";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    admin: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      createdAt: string;
      updatedAt: string;
      role: string;
      isActive: boolean;
      isDeleted: boolean;
    };
    token: string;
  };
}

export interface CreateInstitutionRequest {
  name: string;
  type: string;
  affiliatedBoard: string;
  email: string;
  phone: string;
  website: string;
  yearOfEstablishment: string;
  totalStudentStrength: number;
  address: string;
  primaryColor: string;
  secondaryColor: string;
  password: string;
  proofOfInstitution: File;
  logo?: File;
}

export interface CreateInstitutionResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    type: string;
    affiliatedBoard: string;
    email: string;
    password: string;
    phone: string;
    website: string;
    yearOfEstablishment: string;
    totalStudentStrength: number;
    proofOfInstitutionUrl: string;
    logoUrl?: string | null;
    primaryColor: string;
    secondaryColor: string;
    address: string;
    approvalStatus: string;
    createdAt: string;
    updatedAt: string;
    addedById: string;
  };
}

export interface LoginResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    admin: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      createdAt: string;
      updatedAt: string;
      role: string;
      isActive: boolean;
      isDeleted: boolean;
    };
    token: string;
  };
}

export interface InstitutionStatsResponse {
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

export interface Institution {
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

export interface InstitutionsResponse {
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

class ApiClient {
  private getAuthHeaders() {
    const tokenKey = process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY || "auth_token";
    const token = localStorage.getItem(tokenKey);
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "An error occurred" }));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`,
      );
    }
    return response.json();
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(
      `${BASE_URL}/super-admin/auth/super-admin/register-super-institution-admin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    const result = await this.handleResponse<RegisterResponse>(response);

    // Store token in localStorage if registration is successful
    if (result.data.token) {
      const tokenKey =
        process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY || "auth_token";
      localStorage.setItem(tokenKey, result.data.token);
    }

    return result;
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(
      `${BASE_URL}/super-admin/auth/super-institution-admin/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    const result = await this.handleResponse<LoginResponse>(response);

    // Store token in localStorage
    if (result.data.token) {
      const tokenKey =
        process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY || "auth_token";
      localStorage.setItem(tokenKey, result.data.token);
    }

    return result;
  }

  async getInstitutionStats(
    institutionId: string,
  ): Promise<InstitutionStatsResponse> {
    const response = await fetch(
      `${BASE_URL}/super-admin/institutions/${institutionId}/stats`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      },
    );

    return this.handleResponse(response);
  }

  async getMyInstitutions(
    page: number = 1,
    limit: number = 10,
  ): Promise<InstitutionsResponse> {
    const response = await fetch(
      `${BASE_URL}/super-admin/institutions/my?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      },
    );

    return this.handleResponse(response);
  }

  logout() {
    const tokenKey = process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY || "auth_token";
    localStorage.removeItem(tokenKey);
  }

  isAuthenticated(): boolean {
    const tokenKey = process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY || "auth_token";
    return !!localStorage.getItem(tokenKey);
  }

  getToken(): string | null {
    const tokenKey = process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY || "auth_token";
    return localStorage.getItem(tokenKey);
  }

  async createInstitution(
    data: CreateInstitutionRequest,
  ): Promise<CreateInstitutionResponse> {
    const formData = new FormData();

    // Add all form fields
    formData.append("name", data.name);
    formData.append("type", data.type);
    formData.append("affiliatedBoard", data.affiliatedBoard);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("website", data.website);
    formData.append("yearOfEstablishment", data.yearOfEstablishment);
    formData.append(
      "totalStudentStrength",
      data.totalStudentStrength.toString(),
    );
    formData.append("address", data.address);
    formData.append("primaryColor", data.primaryColor);
    formData.append("secondaryColor", data.secondaryColor);
    formData.append("password", data.password);
    formData.append("proofOfInstitution", data.proofOfInstitution);

    if (data.logo) {
      formData.append("logo", data.logo);
    }

    const token = this.getToken();
    const response = await fetch(`${BASE_URL}/super-admin/institution`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    return this.handleResponse(response);
  }

  getUserInfo(): { firstName: string; lastName: string; email: string } | null {
    try {
      const token = this.getToken();
      if (!token) return null;

      // Decode JWT token to get user info
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        firstName: payload.firstName || "",
        lastName: payload.lastName || "",
        email: payload.email || "",
      };
    } catch {
      return null;
    }
  }
}

export const apiClient = new ApiClient();
