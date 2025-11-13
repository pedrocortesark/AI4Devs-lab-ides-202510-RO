import { CreateCandidateRequest, Candidate, APIError } from '../types/candidate';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010/api';

class CandidateService
{
    /**
     * Create a new candidate
     */
    async createCandidate(data: CreateCandidateRequest): Promise<Candidate>
    {
        const response = await fetch(`${API_BASE_URL}/candidates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok)
        {
            const error: APIError = await response.json();
            throw new Error(error.error.message || 'Error al crear el candidato');
        }

        const result = await response.json();
        return result.data;
    }

    /**
     * Get candidate by ID
     */
    async getCandidateById(id: string): Promise<Candidate>
    {
        const response = await fetch(`${API_BASE_URL}/candidates/${id}`);

        if (!response.ok)
        {
            const error: APIError = await response.json();
            throw new Error(error.error.message || 'Error al obtener el candidato');
        }

        const result = await response.json();
        return result.data;
    }

    /**
     * Get all candidates with pagination
     */
    async getAllCandidates(page: number = 1, limit: number = 10): Promise<{
        candidates: Candidate[];
        total: number;
    }>
    {
        const response = await fetch(
            `${API_BASE_URL}/candidates?page=${page}&limit=${limit}`
        );

        if (!response.ok)
        {
            const error: APIError = await response.json();
            throw new Error(error.error.message || 'Error al obtener candidatos');
        }

        const result = await response.json();
        return {
            candidates: result.data,
            total: result.pagination.total,
        };
    }
}

const candidateService = new CandidateService();
export default candidateService;
