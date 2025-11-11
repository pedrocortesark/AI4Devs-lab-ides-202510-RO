import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Mock data for education lookups
 * In production, this would come from a database or external service
 */
const INSTITUTIONS = [
    'MIT', 'Stanford University', 'Harvard University', 'UC Berkeley', 'Yale University',
    'Princeton University', 'Cambridge University', 'Oxford University', 'Caltech',
    'ETH Zurich', 'Imperial College London', 'Universidad Complutense de Madrid',
    'UNAM', 'Universidad de Buenos Aires', 'Universidade de São Paulo'
];

const DEGREES = [
    'Associate Degree', 'Bachelor of Arts', 'Bachelor of Science', 'Bachelor of Engineering',
    'Master of Arts', 'Master of Science', 'Master of Business Administration', 'PhD',
    'Doctor of Philosophy', 'Doctor of Medicine', 'Doctor of Education', 'Juris Doctor'
];

const FIELDS_OF_STUDY = [
    'Computer Science', 'Engineering', 'Business Administration', 'Medicine', 'Law',
    'Psychology', 'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Economics',
    'Political Science', 'Sociology', 'History', 'English Literature', 'Art History',
    'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Data Science',
    'Artificial Intelligence', 'Software Engineering', 'Marketing', 'Finance', 'Accounting'
];

/**
 * Mock data for job titles
 */
const JOB_TITLES = [
    'Software Engineer', 'Senior Software Engineer', 'Staff Engineer', 'Principal Engineer',
    'Engineering Manager', 'Product Manager', 'Senior Product Manager', 'Director of Engineering',
    'Chief Technology Officer', 'Data Scientist', 'Data Analyst', 'ML Engineer',
    'DevOps Engineer', 'Site Reliability Engineer', 'QA Engineer', 'UX Designer',
    'UI Designer', 'Product Designer', 'Marketing Manager', 'Sales Manager', 'HR Manager',
    'Financial Analyst', 'Business Analyst', 'Project Manager', 'Scrum Master',
    'Technical Writer', 'Customer Success Manager', 'Account Manager', 'Recruiter'
];

/**
 * Helper function to search in an array
 * @param data Array to search in
 * @param query Search query
 * @param limit Maximum results to return
 */
const searchItems = (data: string[], query: string, limit: number): string[] =>
{
    const lowerQuery = query.toLowerCase();
    return data
        .filter(item => item.toLowerCase().includes(lowerQuery))
        .slice(0, limit);
};

/**
 * GET /api/lookups/education?query=...
 * Search for education-related terms (institutions, degrees, fields)
 * 
 * Query params:
 * - query: Search term (min 2 characters)
 * 
 * Response: Array of strings (max 10 results)
 */
router.get('/education', (req: Request, res: Response): void =>
{
    const query = req.query.query as string;

    // Validate query parameter
    if (!query || query.trim().length < 2)
    {
        res.status(400).json({
            type: 'https://lti-ats.com/errors/validation-error',
            title: 'Validation Error',
            status: 400,
            detail: 'Query parameter must be at least 2 characters long'
        });
        return;
    }

    // Search in all education-related data
    const institutions = searchItems(INSTITUTIONS, query, 3);
    const degrees = searchItems(DEGREES, query, 3);
    const fields = searchItems(FIELDS_OF_STUDY, query, 4);

    // Combine and limit to 10 results
    const results = [...institutions, ...degrees, ...fields].slice(0, 10);

    res.status(200).json(results);
});

/**
 * GET /api/lookups/titles?query=...
 * Search for job titles
 * 
 * Query params:
 * - query: Search term (min 2 characters)
 * 
 * Response: Array of strings (max 10 results)
 */
router.get('/titles', (req: Request, res: Response): void =>
{
    const query = req.query.query as string;

    // Validate query parameter
    if (!query || query.trim().length < 2)
    {
        res.status(400).json({
            type: 'https://lti-ats.com/errors/validation-error',
            title: 'Validation Error',
            status: 400,
            detail: 'Query parameter must be at least 2 characters long'
        });
        return;
    }

    // Search job titles
    const results = searchItems(JOB_TITLES, query, 10);

    res.status(200).json(results);
});

export { router as lookupRoutes };
