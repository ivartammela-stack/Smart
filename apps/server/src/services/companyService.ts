import Company from '../models/companyModel';

// Create a new company
export const createCompany = async (companyData: any, accountId?: number): Promise<Company> => {
  const company = await Company.create({
    ...companyData,
    account_id: accountId,
  });
  return company;
};

// Get a company by ID (with account filter)
export const getCompanyById = async (id: number, accountId?: number): Promise<Company | null> => {
  const where: any = { id };
  if (accountId) {
    where.account_id = accountId;
  }
  const company = await Company.findOne({ where });
  return company;
};

// Get all companies (filtered by account)
export const getAllCompanies = async (accountId?: number): Promise<Company[]> => {
  const where: any = {};
  if (accountId) {
    where.account_id = accountId;
  }
  
  const companies = await Company.findAll({
    where,
    order: [['createdAt', 'DESC']],
  });
  return companies;
};

// Update a company (with account check)
export const updateCompany = async (id: number, companyData: any, accountId?: number): Promise<Company | null> => {
  const where: any = { id };
  if (accountId) {
    where.account_id = accountId;
  }
  
  const company = await Company.findOne({ where });
  if (!company) return null;
  await company.update(companyData);
  return company;
};

// Delete a company (with account check)
export const deleteCompany = async (id: number, accountId?: number): Promise<boolean> => {
  const where: any = { id };
  if (accountId) {
    where.account_id = accountId;
  }
  
  const company = await Company.findOne({ where });
  if (!company) return false;
  await company.destroy();
  return true;
};

