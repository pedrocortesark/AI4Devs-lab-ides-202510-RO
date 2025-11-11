import multer from 'multer';
import { Request } from 'express';

/**
 * Multer configuration for handling file uploads
 * Uses memory storage to allow validation before saving to disk
 */
const storage = multer.memoryStorage();

/**
 * File filter to only allow PDF files based on MIME type
 * Additional validation (magic number) is done in CandidateDocumentService
 */
const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback
): void =>
{
    // Allow only PDF files
    if (file.mimetype === 'application/pdf')
    {
        callback(null, true);
    }
    else
    {
        callback(null, false);
    }
};

/**
 * Multer upload instance configured for CV uploads
 * - Single file with field name 'cv'
 * - Max file size: 10MB
 * - Memory storage for validation before disk write
 */
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});
