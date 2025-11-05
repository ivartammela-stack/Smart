import Company from '../models/companyModel';

// Create a new company
export const createCompany = async (companyData: any): Promise<Company> => {
  const company = await Company.create(companyData);
  return company;
};

// Get a company by ID
export const getCompanyById = async (id: number): Promise<Company | null> => {
  const company = await Company.findByPk(id);
  return company;
};

// Get all companies
export const getAllCompanies = async (): Promise<Company[]> => {
  const companies = await Company.findAll({
    order: [['createdAt', 'DESC']],
  });
  return companies;
};

// Update a company
export const updateCompany = async (id: number, companyData: any): Promise<Company | null> => {
  const company = await Company.findByPk(id);
  if (!company) return null;
  await company.update(companyData);
  return company;
};

// Delete a company
export const deleteCompany = async (id: number): Promise<boolean> => {
  const company = await Company.findByPk(id);
  if (!company) return false;
  await company.destroy();
  return true;
};

