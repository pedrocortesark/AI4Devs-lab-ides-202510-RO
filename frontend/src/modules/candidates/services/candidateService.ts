import { apiClient } from '../../../shared/services/apiClient';

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCandidateData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export const candidateService = {
  /**
   * Get all candidates
   */
  async getAll(): Promise<Candidate[]> {
    return await apiClient.get<Candidate[]>('/candidates');
  },

  /**
   * Get candidate by ID
   */
  async getById(id: string): Promise<Candidate> {
    return await apiClient.get<Candidate>(`/candidates/${id}`);
  },

  /**
   * Create new candidate
   */
  async create(data: CreateCandidateData): Promise<Candidate> {
    return await apiClient.post<Candidate>('/candidates', data);
  },

  /**
   * Update candidate
   */
  async update(id: string, data: Partial<CreateCandidateData>): Promise<Candidate> {
    return await apiClient.put<Candidate>(`/candidates/${id}`, data);
  },

  /**
   * Delete candidate
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/candidates/${id}`);
  },
};
