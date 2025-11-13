import React, { useRef, useState } from 'react';
import './FileUpload.css';

interface FileUploadProps
{
    onFileSelect: (file: File | null) => void;
    accept?: string;
    maxSizeMB?: number;
    error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
    onFileSelect,
    accept = '.pdf,.doc,.docx',
    maxSizeMB = 10,
    error,
}) =>
{
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatFileSize = (bytes: number): string =>
    {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const validateFile = (file: File): string | null =>
    {
        const maxSizeBytes = maxSizeMB * 1024 * 1024;

        if (file.size > maxSizeBytes)
        {
            return `El archivo excede el tamaño máximo de ${maxSizeMB}MB`;
        }

        const allowedTypes = accept.split(',').map(t => t.trim());
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

        if (!allowedTypes.includes(fileExtension))
        {
            return `Tipo de archivo no permitido. Solo se aceptan: ${accept}`;
        }

        return null;
    };

    const handleFile = (file: File) =>
    {
        const validationError = validateFile(file);

        if (validationError)
        {
            onFileSelect(null);
            setSelectedFile(null);
            alert(validationError);
            return;
        }

        setSelectedFile(file);
        onFileSelect(file);
    };

    const handleDragEnter = (e: React.DragEvent) =>
    {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) =>
    {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) =>
    {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) =>
    {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0)
        {
            handleFile(files[0]);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const files = e.target.files;
        if (files && files.length > 0)
        {
            handleFile(files[0]);
        }
    };

    const handleClick = () =>
    {
        fileInputRef.current?.click();
    };

    const handleRemove = (e: React.MouseEvent) =>
    {
        e.stopPropagation();
        setSelectedFile(null);
        onFileSelect(null);
        if (fileInputRef.current)
        {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="file-upload-wrapper">
            <label className="form-label">
                Curriculum Vitae (CV)
                <span className="form-hint"> - Opcional</span>
            </label>

            <div
                className={`file-upload-area ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''} ${selectedFile ? 'has-file' : ''}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileInputChange}
                    className="file-input-hidden"
                />

                {selectedFile ? (
                    <div className="file-preview">
                        <div className="file-icon">📄</div>
                        <div className="file-info">
                            <div className="file-name">{selectedFile.name}</div>
                            <div className="file-size">{formatFileSize(selectedFile.size)}</div>
                        </div>
                        <button
                            type="button"
                            className="file-remove"
                            onClick={handleRemove}
                            aria-label="Eliminar archivo"
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <div className="file-upload-prompt">
                        <div className="upload-icon">📤</div>
                        <div className="upload-text">
                            <strong>Arrastra tu CV aquí</strong>
                            <span> o haz clic para seleccionar</span>
                        </div>
                        <div className="upload-hint">
                            Formatos: PDF, DOC, DOCX • Máximo {maxSizeMB}MB
                        </div>
                    </div>
                )}
            </div>

            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default FileUpload;
