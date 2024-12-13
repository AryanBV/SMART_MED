const Document = require('../models/Document');
const Patient = require('../models/Patient');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const tesseract = require('node-tesseract-ocr');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/documents';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).single('document');

class DocumentController {
    // Upload document
    static async uploadDocument(req, res) {
        try {
            upload(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        message: err.message
                    });
                }

                if (!req.file) {
                    return res.status(400).json({
                        success: false,
                        message: 'No file uploaded'
                    });
                }

                const documentData = {
                    patient_id: req.body.patient_id,
                    document_type: req.body.document_type,
                    file_name: req.file.originalname,
                    file_path: req.file.path,
                    metadata: {
                        size: req.file.size,
                        mimetype: req.file.mimetype,
                        upload_date: new Date()
                    }
                };

                const documentId = await Document.create(documentData);

                // Start OCR processing in background
                this.processDocument(documentId, req.file.path);

                res.status(201).json({
                    success: true,
                    message: 'Document uploaded successfully',
                    data: { document_id: documentId }
                });
            });
        } catch (error) {
            console.error('Error uploading document:', error);
            res.status(500).json({
                success: false,
                message: 'Error uploading document',
                error: error.message
            });
        }
    }

    // Process document using OCR
    static async processDocument(documentId, filePath) {
        try {
            const config = {
                lang: "eng",
                oem: 1,
                psm: 3,
            };

            const text = await tesseract.recognize(filePath, config);
            
            // Extract relevant information using regex patterns
            const processedData = {
                processed_text: text,
                processed_status: 'completed',
                metadata: {
                    processed_date: new Date(),
                    medications: this.extractMedications(text),
                    dates: this.extractDates(text)
                }
            };

            await Document.updateProcessingResults(documentId, processedData);
        } catch (error) {
            console.error('Error processing document:', error);
            await Document.updateProcessingResults(documentId, {
                processed_status: 'failed',
                metadata: { error: error.message }
            });
        }
    }

    // Get document by ID
    static async getDocument(req, res) {
        try {
            const documentId = req.params.id;
            
            const document = await Document.findById(documentId);
            if (!document) {
                return res.status(404).json({
                    success: false,
                    message: 'Document not found'
                });
            }

            res.json({
                success: true,
                data: document
            });
        } catch (error) {
            console.error('Error fetching document:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching document',
                error: error.message
            });
        }
    }

    // Get all documents for a patient
    static async getPatientDocuments(req, res) {
        try {
            const patientId = req.params.patientId;
            const documents = await Document.findByPatientId(patientId);

            res.json({
                success: true,
                data: documents
            });
        } catch (error) {
            console.error('Error fetching patient documents:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching patient documents',
                error: error.message
            });
        }
    }

    // Delete document
    static async deleteDocument(req, res) {
        try {
            const documentId = req.params.id;
            const document = await Document.findById(documentId);
            
            if (!document) {
                return res.status(404).json({
                    success: false,
                    message: 'Document not found'
                });
            }

            // Delete file from storage
            if (fs.existsSync(document.file_path)) {
                fs.unlinkSync(document.file_path);
            }

            // Delete record from database
            await Document.delete(documentId);

            res.json({
                success: true,
                message: 'Document deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting document:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting document',
                error: error.message
            });
        }
    }

    // Helper methods for text extraction
    static extractMedications(text) {
        // Add regex patterns for medication extraction
        const medicationPatterns = [
            /(\d+\s*mg|\d+\s*ml)\s+[A-Za-z]+/g,
            /[A-Za-z]+\s+(\d+\s*mg|\d+\s*ml)/g
        ];
        
        let medications = [];
        medicationPatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
                medications = [...medications, ...matches];
            }
        });
        
        return [...new Set(medications)]; // Remove duplicates
    }

    static extractDates(text) {
        const datePattern = /\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/g;
        return text.match(datePattern) || [];
    }
}

module.exports = DocumentController;