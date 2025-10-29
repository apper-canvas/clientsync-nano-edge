import { getApperClient } from "@/services/apperClient";

const activityTypes = ["Call", "Email", "Meeting", "Task", "Note"];

export const activitiesService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "dealId_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('activity_c', parseInt(id), {
        fields: [
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "dealId_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error("Activity not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error?.message || error);
      throw error;
    }
  },

  async create(activityData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          type_c: activityData.type_c,
          subject_c: activityData.subject_c,
          description_c: activityData.description_c || null,
          contactId_c: activityData.contactId_c ? parseInt(activityData.contactId_c) : null,
          dealId_c: activityData.dealId_c ? parseInt(activityData.dealId_c) : null,
          dueDate_c: activityData.dueDate_c,
          completed_c: activityData.completed_c || false,
          createdAt_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('activity_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create activity:`, failed);
          throw new Error(failed[0].message || "Failed to create activity");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating activity:", error?.message || error);
      throw error;
    }
  },

  async update(id, activityData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          Id: parseInt(id),
          type_c: activityData.type_c,
          subject_c: activityData.subject_c,
          description_c: activityData.description_c || null,
          contactId_c: activityData.contactId_c ? parseInt(activityData.contactId_c) : null,
          dealId_c: activityData.dealId_c ? parseInt(activityData.dealId_c) : null,
          dueDate_c: activityData.dueDate_c,
          completed_c: activityData.completed_c || false
        }]
      };

      const response = await apperClient.updateRecord('activity_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update activity:`, failed);
          throw new Error(failed[0].message || "Failed to update activity");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error(`Error updating activity ${id}:`, error?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('activity_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete activity:`, failed);
          throw new Error(failed[0].message || "Failed to delete activity");
        }
      }

      return true;
    } catch (error) {
      console.error(`Error deleting activity ${id}:`, error?.message || error);
      throw error;
    }
  },

  async getByContactId(contactId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "dealId_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}}
        ],
        where: [{
          FieldName: "contactId_c",
          Operator: "EqualTo",
          Values: [parseInt(contactId)]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching activities for contact ${contactId}:`, error?.message || error);
      return [];
    }
  },

  async getByDealId(dealId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "dealId_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}}
        ],
        where: [{
          FieldName: "dealId_c",
          Operator: "EqualTo",
          Values: [parseInt(dealId)]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching activities for deal ${dealId}:`, error?.message || error);
      return [];
    }
  },

  async markCompleted(id) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          Id: parseInt(id),
          completed_c: true
        }]
      };

      const response = await apperClient.updateRecord('activity_c', payload);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to mark activity completed:`, failed);
          throw new Error(failed[0].message || "Failed to mark activity completed");
        }
        return response.results[0].data;
      }

      return response.data;
    } catch (error) {
      console.error(`Error marking activity ${id} completed:`, error?.message || error);
      throw error;
    }
  },

  async getUpcoming(limit = 10) {
    try {
      const apperClient = getApperClient();
      const now = new Date().toISOString();
      
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "dealId_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}}
        ],
        where: [
          {
            FieldName: "completed_c",
            Operator: "EqualTo",
            Values: [false]
          },
          {
            FieldName: "dueDate_c",
            Operator: "GreaterThanOrEqualTo",
            Values: [now]
          }
        ],
        orderBy: [{
          fieldName: "dueDate_c",
          sorttype: "ASC"
        }],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching upcoming activities:", error?.message || error);
      return [];
    }
  },

  async getOverdue() {
    try {
      const apperClient = getApperClient();
      const now = new Date().toISOString();
      
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "dealId_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}}
        ],
        where: [
          {
            FieldName: "completed_c",
            Operator: "EqualTo",
            Values: [false]
          },
          {
            FieldName: "dueDate_c",
            Operator: "LessThan",
            Values: [now]
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching overdue activities:", error?.message || error);
      return [];
    }
  },

  getActivityTypes() {
    return [...activityTypes];
  }
};