import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from '../services/companyService';

// Get all companies
export const getCompanies = async (req: AuthRequest, res: Response) => {
  try {
    const companies = await getAllCompanies(req.accountId);
    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message });
  }
};

// Get single company
export const getCompany = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const company = await getCompanyById(id, req.accountId);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message });
  }
};

// Create company
export const createNewCompany = async (req: AuthRequest, res: Response) => {
  try {
    // Add created_by and account_id from authenticated user
    const companyData = {
      ...req.body,
      created_by: req.user?.id,
    };
    
    const company = await createCompany(companyData, req.accountId);
    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ success: false, message });
  }
};

// Update company
export const updateExistingCompany = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const company = await updateCompany(id, req.body, req.accountId);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: company,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ success: false, message });
  }
};

// Delete company
export const removeCompany = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await deleteCompany(id, req.accountId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Company deleted successfully',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message });
  }
};

