import { ZammadService } from './zammad';
import { storage } from '../storage';

// Ticket synchronization service for importing Zammad data to local database
class TicketSyncService {
  private zammadService: ZammadService;

  constructor() {
    this.zammadService = new ZammadService();
  }

  // Option 1: Real-time sync - Import tickets as they're created/updated
  async syncTicketFromZammad(zammadTicketId: string) {
    try {
      // Get ticket from Zammad
      const zammadTicket = await this.zammadService.getTicketById(zammadTicketId);
      
      if (!zammadTicket) {
        throw new Error(`Ticket ${zammadTicketId} not found in Zammad`);
      }

      // Find the customer in our local database by email
      const customerEmail = zammadTicket.customer?.email;
      if (!customerEmail) {
        console.warn(`No customer email found for ticket ${zammadTicketId}`);
        return null;
      }

      const localUser = await storage.getUserByEmail(customerEmail);
      if (!localUser) {
        console.warn(`Customer ${customerEmail} not found in local database`);
        return null;
      }

      // Create ticket record in local database for reporting/analytics
      const localTicket = {
        zammadTicketId: zammadTicket.id?.toString(),
        customerId: localUser.id,
        subject: zammadTicket.title,
        status: this.mapZammadStatus(zammadTicket.state_id),
        priority: this.mapZammadPriority(zammadTicket.priority_id),
        createdAt: new Date(zammadTicket.created_at || Date.now()),
        updatedAt: new Date(zammadTicket.updated_at || Date.now())
      };

      // Store in local database if you need it for analytics/reporting
      // Note: This would require adding back a tickets table for analytics only
      return localTicket;

    } catch (error) {
      console.error(`Error syncing ticket ${zammadTicketId}:`, error);
      throw error;
    }
  }

  // Option 2: Bulk import - Import all tickets from Zammad
  async bulkImportTickets(customerId?: number) {
    try {
      let tickets;
      
      if (customerId) {
        // Import tickets for specific customer
        const user = await storage.getUser(customerId);
        if (!user?.email) {
          throw new Error(`Customer ${customerId} not found`);
        }
        tickets = await this.zammadService.getTicketsByCustomerEmail(user.email);
      } else {
        // Import all tickets
        tickets = await this.zammadService.getAllTickets();
      }

      const importedTickets = [];
      for (const ticket of tickets) {
        const synced = await this.syncTicketFromZammad(ticket.id?.toString() || '');
        if (synced) {
          importedTickets.push(synced);
        }
      }

      return {
        total: tickets.length,
        imported: importedTickets.length,
        tickets: importedTickets
      };

    } catch (error) {
      console.error('Error in bulk import:', error);
      throw error;
    }
  }

  // Option 3: Scheduled sync - Regular background import
  async scheduledSync() {
    try {
      // Get tickets modified in last 24 hours
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentTickets = await this.zammadService.getTicketsModifiedSince(since);

      for (const ticket of recentTickets) {
        await this.syncTicketFromZammad(ticket.id?.toString() || '');
      }

      console.log(`Synchronized ${recentTickets.length} tickets from Zammad`);
      return recentTickets.length;

    } catch (error) {
      console.error('Error in scheduled sync:', error);
      throw error;
    }
  }

  // Option 4: Webhook-based sync - Real-time updates from Zammad
  async handleZammadWebhook(webhookData: any) {
    try {
      const { action, ticket } = webhookData;
      
      switch (action) {
        case 'ticket.create':
        case 'ticket.update':
          await this.syncTicketFromZammad(ticket.id);
          break;
        case 'ticket.delete':
          // Handle ticket deletion if needed
          break;
      }

    } catch (error) {
      console.error('Error handling Zammad webhook:', error);
      throw error;
    }
  }

  // Helper methods
  private mapZammadStatus(stateId?: number): string {
    switch (stateId) {
      case 1: return 'new';
      case 2: return 'open';
      case 3: return 'pending';
      case 4: return 'closed';
      default: return 'unknown';
    }
  }

  private mapZammadPriority(priorityId?: number): string {
    switch (priorityId) {
      case 1: return 'low';
      case 2: return 'normal';
      case 3: return 'high';
      default: return 'normal';
    }
  }
}

export const ticketSyncService = new TicketSyncService();