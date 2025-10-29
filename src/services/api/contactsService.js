import { getApperClient } from "@/services/apperClient";

export const contactsService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('contact_c', {
        fields: [
          {"field": {"Name": "firstName_c"}},
          {"field": {"Name": "lastName_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "companyId_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "updatedAt_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('contact_c', parseInt(id), {
        fields: [
          {"field": {"Name": "firstName_c"}},
          {"field": {"Name": "lastName_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "companyId_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "updatedAt_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error("Contact not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.message || error);
      throw error;
    }
  },

  async create(contactData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          firstName_c: contactData.firstName_c,
          lastName_c: contactData.lastName_c,
          email_c: contactData.email_c,
          phone_c: contactData.phone_c || null,
          companyId_c: contactData.companyId_c ? parseInt(contactData.companyId_c) : null,
          title_c: contactData.title_c || null,
          notes_c: contactData.notes_c || null,
          createdAt_c: new Date().toISOString(),
          updatedAt_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('contact_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create contact:`, failed);
          throw new Error(failed[0].message || "Failed to create contact");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating contact:", error?.message || error);
      throw error;
    }
  },

  async update(id, contactData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          Id: parseInt(id),
          firstName_c: contactData.firstName_c,
          lastName_c: contactData.lastName_c,
          email_c: contactData.email_c,
          phone_c: contactData.phone_c || null,
          companyId_c: contactData.companyId_c ? parseInt(contactData.companyId_c) : null,
          title_c: contactData.title_c || null,
          notes_c: contactData.notes_c || null,
          updatedAt_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.updateRecord('contact_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update contact:`, failed);
          throw new Error(failed[0].message || "Failed to update contact");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error(`Error updating contact ${id}:`, error?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('contact_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete contact:`, failed);
          throw new Error(failed[0].message || "Failed to delete contact");
        }
      }

      return true;
    } catch (error) {
      console.error(`Error deleting contact ${id}:`, error?.message || error);
      throw error;
    }
  },

  async searchContacts(query) {
    try {
      const apperClient = getApperClient();
      
      if (!query) return await this.getAll();

      const response = await apperClient.fetchRecords('contact_c', {
        fields: [
          {"field": {"Name": "firstName_c"}},
          {"field": {"Name": "lastName_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "companyId_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "updatedAt_c"}}
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {
                  fieldName: "firstName_c",
                  operator: "Contains",
                  values: [query]
                }
              ]
            },
            {
              conditions: [
                {
                  fieldName: "lastName_c",
                  operator: "Contains",
                  values: [query]
                }
              ]
            },
            {
              conditions: [
                {
                  fieldName: "email_c",
                  operator: "Contains",
                  values: [query]
                }
              ]
            },
            {
              conditions: [
                {
                  fieldName: "title_c",
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
      console.error("Error searching contacts:", error?.message || error);
      return [];
    }
  },

  async bulkUpdate(contactIds, updateData) {
    try {
      const apperClient = getApperClient();
      
      const records = contactIds.map(id => ({
        Id: parseInt(id),
        ...updateData,
        updatedAt_c: new Date().toISOString()
      }));

      const response = await apperClient.updateRecord('contact_c', { records });

      if (!response.success) {
        console.error(response.message);
        return {
          updated: [],
          errors: [{ error: response.message }],
          successCount: 0,
          errorCount: contactIds.length
        };
      }

      const updated = response.results ? response.results.filter(r => r.success).map(r => r.data) : [];
      const errors = response.results ? response.results.filter(r => !r.success).map(r => ({ id: r.Id, error: r.message })) : [];

      if (errors.length > 0) {
        console.error(`Failed to update ${errors.length} contacts:`, errors);
      }

      return {
        updated,
        errors,
        successCount: updated.length,
        errorCount: errors.length
      };
    } catch (error) {
      console.error("Error bulk updating contacts:", error?.message || error);
      return {
        updated: [],
        errors: [{ error: error.message }],
        successCount: 0,
        errorCount: contactIds.length
      };
    }
  },

  async bulkDelete(contactIds) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('contact_c', {
        RecordIds: contactIds.map(id => parseInt(id))
      });

      if (!response.success) {
        console.error(response.message);
        return {
          deleted: [],
          errors: [{ error: response.message }],
          successCount: 0,
          errorCount: contactIds.length
        };
      }

      const deleted = response.results ? response.results.filter(r => r.success) : [];
      const errors = response.results ? response.results.filter(r => !r.success).map(r => ({ id: r.Id, error: r.message })) : [];

      if (errors.length > 0) {
        console.error(`Failed to delete ${errors.length} contacts:`, errors);
      }

      return {
        deleted,
        errors,
        successCount: deleted.length,
        errorCount: errors.length
      };
    } catch (error) {
      console.error("Error bulk deleting contacts:", error?.message || error);
      return {
        deleted: [],
        errors: [{ error: error.message }],
        successCount: 0,
        errorCount: contactIds.length
      };
    }
  },

  async bulkExport(contactsData) {
    try {
      const headers = [
        'ID', 'First Name', 'Last Name', 'Email', 'Phone', 
        'Title', 'Company', 'Created At', 'Updated At'
      ];
      
      const csvRows = [
        headers.join(','),
        ...contactsData.map(contact => [
          contact.Id,
          `"${contact.firstName_c || ''}"`,
          `"${contact.lastName_c || ''}"`,
          `"${contact.email_c || ''}"`,
          `"${contact.phone_c || ''}"`,
          `"${contact.title_c || ''}"`,
          `"${contact.companyId_c?.Name || ''}"`,
          `"${contact.createdAt_c || ''}"`,
          `"${contact.updatedAt_c || ''}"`
        ].join(','))
      ];
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return {
        success: true,
        filename: `contacts_export_${new Date().toISOString().split('T')[0]}.csv`,
        count: contactsData.length
      };
    } catch (error) {
      console.error("Error exporting contacts:", error?.message || error);
      throw error;
    }
  }
};