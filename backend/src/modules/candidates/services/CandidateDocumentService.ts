import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Custom error for document-related operations
 */
export class DocumentError extends Error
{
    constructor(
        message: string,
        public readonly statusCode: number = 400,
        public readonly code?: string
    )
    {
        super(message);
        this.name = 'DocumentError';
    }
}

/**
 * Service for handling candidate document uploads and validation
 */
export class CandidateDocumentService
{
    private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    private readonly ALLOWED_MIME_TYPES = ['application/pdf'];
    private readonly PDF_MAGIC_NUMBERS = [0x25, 0x50, 0x44, 0x46]; // %PDF-
    private readonly UPLOAD_BASE_PATH = './uploads/cv';

    /**
     * Validates if a file is a valid PDF by checking magic numbers
     * @param buffer File buffer to validate
     * @returns true if file is a valid PDF
     */
    private validatePDFMagicNumber(buffer: Buffer): boolean
    {
        if (buffer.length < 4)
        {
            return false;
        }

        // Check for %PDF- signature at the beginning
        for (let i = 0; i < this.PDF_MAGIC_NUMBERS.length; i++)
        {
            if (buffer[i] !== this.PDF_MAGIC_NUMBERS[i])
            {
                return false;
            }
        }

        return true;
    }

    /**
     * Validates uploaded file size, MIME type, and content
     * @param file Multer file object
     * @throws DocumentError if validation fails
     */
    async validateDocument(file: Express.Multer.File): Promise<void>
    {
        // Check file size
        if (file.size > this.MAX_FILE_SIZE)
        {
            throw new DocumentError(
                `File size exceeds maximum allowed size of ${this.MAX_FILE_SIZE / 1024 / 1024}MB`,
                413,
                'FILE_TOO_LARGE'
            );
        }

        // Check MIME type
        if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype))
        {
            throw new DocumentError(
                'Only PDF files are allowed. DOCX and other formats are not supported.',
                415,
                'UNSUPPORTED_MEDIA_TYPE'
            );
        }

        // Check magic number (actual file content)
        if (!this.validatePDFMagicNumber(file.buffer))
        {
            throw new DocumentError(
                'File is not a valid PDF document',
                415,
                'INVALID_PDF'
            );
        }
    }

    /**
     * Saves uploaded PDF to disk with unique filename
     * @param candidateId ID of the candidate
     * @param file Multer file object
     * @returns Object with filePath and fileName
     */
    async saveDocument(
        candidateId: string,
        file: Express.Multer.File
    ): Promise<{ filePath: string; fileName: string }>
    {
        // Validate document first
        await this.validateDocument(file);

        // Create directory structure: ./uploads/cv/{candidateId}/
        const candidateUploadDir = path.join(this.UPLOAD_BASE_PATH, candidateId);
        await fs.mkdir(candidateUploadDir, { recursive: true });

        // Generate unique filename with original extension
        const fileExtension = path.extname(file.originalname);
        const uniqueFilename = `${uuidv4()}${fileExtension}`;
        const filePath = path.join(candidateUploadDir, uniqueFilename);

        // Write file to disk
        await fs.writeFile(filePath, file.buffer);

        return {
            filePath,
            fileName: file.originalname
        };
    }

    /**
     * Deletes a document file from disk
     * @param filePath Path to the file to delete
     */
    async deleteDocument(filePath: string): Promise<void>
    {
        try
        {
            await fs.unlink(filePath);
        }
        catch (error)
        {
            // Log error but don't throw - file might not exist
            console.error(`Failed to delete file ${filePath}:`, error);
        }
    }

    /**
     * Checks if a file exists
     * @param filePath Path to check
     * @returns true if file exists
     */
    async fileExists(filePath: string): Promise<boolean>
    {
        try
        {
            await fs.access(filePath);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
