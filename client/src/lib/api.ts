import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("rf_token") : null;
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = (res: any) => {
  return res.data;
};

export const api = {
  // Authentication
  register: async (email: string, name: string, password: string) => {
    const res = await axios.post(`${API_URL}/auth/register`, { email, name, password });
    return handleResponse(res);
  },

  login: async (email: string, password: string) => {
    // Standard JSON login
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await axios.get(`${API_URL}/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("rf_token");
      localStorage.removeItem("rf_user");
    }
  },

  // Resumes
  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post(`${API_URL}/resumes/upload`, formData, {
      headers: {
        ...getHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
    return handleResponse(res);
  },

  getResumes: async () => {
    const res = await axios.get(`${API_URL}/resumes`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getResume: async (id: string) => {
    const res = await axios.get(`${API_URL}/resumes/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getResumeReport: async (id: string) => {
    const res = await axios.get(`${API_URL}/resumes/${id}/report`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  deleteResume: async (id: string) => {
    const res = await axios.delete(`${API_URL}/resumes/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Job matching
  matchResume: async (resumeId: string, title: string, company: string, jobContent: string) => {
    const res = await axios.post(
      `${API_URL}/jobs/match`,
      {
        resume_id: resumeId,
        title,
        company,
        job_content: jobContent,
      },
      {
        headers: getHeaders(),
      }
    );
    return handleResponse(res);
  },

  getMatchHistory: async () => {
    const res = await axios.get(`${API_URL}/jobs/history`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // AI services
  improveResume: async (resumeId: string) => {
    const res = await axios.post(`${API_URL}/ai/improve/${resumeId}`, {}, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  generateCoverLetter: async (resumeId: string, companyName: string, jobTitle: string, jobDescription: string, tone: string) => {
    const res = await axios.post(
      `${API_URL}/ai/coverletter`,
      {
        resume_id: resumeId,
        company_name: companyName,
        job_title: jobTitle,
        job_description: jobDescription,
        tone,
      },
      {
        headers: getHeaders(),
      }
    );
    return handleResponse(res);
  },

  getCoverLetters: async () => {
    const res = await axios.get(`${API_URL}/ai/coverletters`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  generateInterviewPrep: async (resumeId: string, jobTitle: string, jobDescription: string) => {
    const res = await axios.post(
      `${API_URL}/ai/interview`,
      {
        resume_id: resumeId,
        job_title: jobTitle,
        job_description: jobDescription,
      },
      {
        headers: getHeaders(),
      }
    );
    return handleResponse(res);
  },

  generateCareerRoadmap: async (resumeId: string) => {
    const res = await axios.post(`${API_URL}/ai/roadmap/${resumeId}`, {}, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Job tracker
  getApplications: async () => {
    const res = await axios.get(`${API_URL}/applications`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createApplication: async (app: { company: string; role: string; status: string; notes?: string; salary?: string }) => {
    const res = await axios.post(`${API_URL}/applications`, app, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateApplication: async (id: string, app: any) => {
    const res = await axios.put(`${API_URL}/applications/${id}`, app, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  deleteApplication: async (id: string) => {
    const res = await axios.delete(`${API_URL}/applications/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
