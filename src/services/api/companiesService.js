import { getApperClient } from "@/services/apperClient";

export const companiesService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('company_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching companies:", error?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('company_c', parseInt(id), {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error("Company not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching company ${id}:`, error?.message || error);
      throw error;
    }
  },

  async create(companyData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          name_c: companyData.name_c,
          industry_c: companyData.industry_c,
          size_c: companyData.size_c,
          website_c: companyData.website_c || null,
          address_c: companyData.address_c || null,
          notes_c: companyData.notes_c || null,
          createdAt_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('company_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create company:`, failed);
          throw new Error(failed[0].message || "Failed to create company");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating company:", error?.message || error);
      throw error;
    }
  },

  async update(id, companyData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          Id: parseInt(id),
          name_c: companyData.name_c,
          industry_c: companyData.industry_c,
          size_c: companyData.size_c,
          website_c: companyData.website_c || null,
          address_c: companyData.address_c || null,
          notes_c: companyData.notes_c || null
        }]
      };

      const response = await apperClient.updateRecord('company_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update company:`, failed);
          throw new Error(failed[0].message || "Failed to update company");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error(`Error updating company ${id}:`, error?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('company_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete company:`, failed);
          throw new Error(failed[0].message || "Failed to delete company");
        }
      }

      return true;
    } catch (error) {
      console.error(`Error deleting company ${id}:`, error?.message || error);
      throw error;
    }
  },

  async searchCompanies(query) {
    try {
      const apperClient = getApperClient();
      
      if (!query) return await this.getAll();

      const response = await apperClient.fetchRecords('company_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}}
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {
                  fieldName: "name_c",
                  operator: "Contains",
                  values: [query]
                }
              ]
            },
            {
              conditions: [
                {
                  fieldName: "industry_c",
                  operator: "Contains",
                  values: [query]
                }
              ]
            },
            {
              conditions: [
                {
                  fieldName: "size_c",
                  operator: "Contains",
                  values: [query]
                }
              ]
            }
          ]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching companies:", error?.message || error);
      return [];
    }
  }
};