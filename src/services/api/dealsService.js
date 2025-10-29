import { getApperClient } from "@/services/apperClient";

const dealStages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];

export const dealsService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('deal_c', {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "companyId_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "closeDate_c"}},
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
      console.error("Error fetching deals:", error?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('deal_c', parseInt(id), {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "companyId_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "closeDate_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error("Deal not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.message || error);
      throw error;
    }
  },

  async create(dealData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          title_c: dealData.title_c,
          value_c: parseFloat(dealData.value_c),
          stage_c: dealData.stage_c,
          contactId_c: dealData.contactId_c ? parseInt(dealData.contactId_c) : null,
          companyId_c: dealData.companyId_c ? parseInt(dealData.companyId_c) : null,
          probability_c: dealData.probability_c ? parseInt(dealData.probability_c) : 0,
          closeDate_c: dealData.closeDate_c,
          notes_c: dealData.notes_c || null,
          createdAt_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('deal_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create deal:`, failed);
          throw new Error(failed[0].message || "Failed to create deal");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating deal:", error?.message || error);
      throw error;
    }
  },

  async update(id, dealData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          Id: parseInt(id),
          title_c: dealData.title_c,
          value_c: parseFloat(dealData.value_c),
          stage_c: dealData.stage_c,
          contactId_c: dealData.contactId_c ? parseInt(dealData.contactId_c) : null,
          companyId_c: dealData.companyId_c ? parseInt(dealData.companyId_c) : null,
          probability_c: dealData.probability_c ? parseInt(dealData.probability_c) : 0,
          closeDate_c: dealData.closeDate_c,
          notes_c: dealData.notes_c || null
        }]
      };

      const response = await apperClient.updateRecord('deal_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update deal:`, failed);
          throw new Error(failed[0].message || "Failed to update deal");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error(`Error updating deal ${id}:`, error?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('deal_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete deal:`, failed);
          throw new Error(failed[0].message || "Failed to delete deal");
        }
      }

      return true;
    } catch (error) {
      console.error(`Error deleting deal ${id}:`, error?.message || error);
      throw error;
    }
  },

  async updateStage(id, newStage) {
    try {
      if (!dealStages.includes(newStage)) {
        throw new Error("Invalid deal stage");
      }

      const apperClient = getApperClient();
      
      const probability = newStage === "Closed Won" ? 100 : newStage === "Closed Lost" ? 0 : null;
      
      const payload = {
        records: [{
          Id: parseInt(id),
          stage_c: newStage
        }]
      };

      if (probability !== null) {
        payload.records[0].probability_c = probability;
      }

      const response = await apperClient.updateRecord('deal_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update deal stage:`, failed);
          throw new Error(failed[0].message || "Failed to update deal stage");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error(`Error updating deal stage ${id}:`, error?.message || error);
      throw error;
    }
  },

  async getDealsByStage() {
    try {
      const allDeals = await this.getAll();
      const dealsByStage = {};
      
      dealStages.forEach(stage => {
        dealsByStage[stage] = allDeals.filter(deal => deal.stage_c === stage);
      });
      
      return dealsByStage;
    } catch (error) {
      console.error("Error fetching deals by stage:", error?.message || error);
      return {};
    }
  },

  getDealStages() {
    return [...dealStages];
  }
};