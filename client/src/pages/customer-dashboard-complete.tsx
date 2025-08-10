import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import {
  Star,
  LogOut,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Loader2,
  ExternalLink,
  MessageSquare,
  User,
  Calendar,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Send
} from "lucide-react";

// Form schemas
const createTicketSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

const replySchema = z.object({
  message: z.string().min(1, "Message is required"),
});

type CreateTicketData = z.infer<typeof createTicketSchema>;
type ReplyData = z.infer<typeof replySchema>;

// Ticket Detail Modal Component
function TicketDetailModal({ ticket, isOpen, onClose }: { ticket: any; isOpen: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showReplyForm, setShowReplyForm] = useState(false);

  const replyForm = useForm<ReplyData>({
    resolver: zodResolver(replySchema),
    defaultValues: { message: "" },
  });

  // Fetch ticket details and articles
  const { data: ticketDetail, isLoading: detailLoading } = useQuery({
    queryKey: ['/api/customer/tickets', ticket?.id],
    enabled: !!ticket?.id && isOpen,
  });

  // Reply mutation
  const replyMutation = useMutation({
    mutationFn: async (data: ReplyData) => {
      const response = await fetch(`/api/customer/tickets/${ticket.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send reply');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Reply Sent",
        description: "Your reply has been sent successfully.",
      });
      replyForm.reset();
      setShowReplyForm(false);
      queryClient.invalidateQueries({ queryKey: ['/api/customer/tickets', ticket.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/customer/tickets'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onReplySubmit = (data: ReplyData) => {
    replyMutation.mutate(data);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': case 'closed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isOpen || !ticket) return null;

  const detail = (ticketDetail as any)?.ticket || ticket;
  const articles = (ticketDetail as any)?.articles || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl mb-2">
                #{detail.number || detail.id} - {detail.title || 'Untitled Ticket'}
              </DialogTitle>
              <div className="flex items-center space-x-3">
                <Badge className={getPriorityColor(detail.priority || 'medium')}>
                  {(detail.priority || 'medium').charAt(0).toUpperCase() + (detail.priority || 'medium').slice(1)} Priority
                </Badge>
                <Badge className={getStatusColor(detail.state || 'open')}>
                  {(detail.state || 'open').charAt(0).toUpperCase() + (detail.state || 'open').slice(1)}
                </Badge>
                <span className="text-sm text-gray-500">
                  Created: {detail.created_at ? formatDistanceToNow(new Date(detail.created_at), { addSuffix: true }) : 'Unknown'}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`http://zammad.star.ca:8080/customer_ticket_zoom/${detail.id}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Zammad
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {detailLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Initial ticket description */}
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-blue-900">You</span>
                      <span className="text-sm text-blue-600">
                        {detail.created_at ? formatDistanceToNow(new Date(detail.created_at), { addSuffix: true }) : 'Unknown time'}
                      </span>
                    </div>
                    <div className="text-blue-800 whitespace-pre-wrap">
                      {detail.note || detail.description || 'No description provided.'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket articles/replies */}
              {articles.map((article: any, index: number) => (
                <div key={article.id || index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      {article.sender === 'Customer' ? (
                        <User className="h-4 w-4 text-gray-600" />
                      ) : (
                        <MessageSquare className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {article.from || (article.sender === 'Customer' ? 'You' : 'Support Agent')}
                        </span>
                        <span className="text-sm text-gray-500">
                          {article.created_at ? formatDistanceToNow(new Date(article.created_at), { addSuffix: true }) : 'Unknown time'}
                        </span>
                      </div>
                      <div className="text-gray-700 whitespace-pre-wrap">
                        {article.body || 'No content'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {articles.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No replies yet</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reply section */}
        <div className="border-t pt-4">
          {!showReplyForm ? (
            <div className="flex justify-center">
              <Button onClick={() => setShowReplyForm(true)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Reply to Ticket
              </Button>
            </div>
          ) : (
            <Form {...replyForm}>
              <form onSubmit={replyForm.handleSubmit(onReplySubmit)} className="space-y-4">
                <FormField
                  control={replyForm.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Reply</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Type your reply here..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowReplyForm(false);
                      replyForm.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={replyMutation.isPending}>
                    {replyMutation.isPending && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main Tickets List Component
function EnhancedTicketsList() {
  const { user } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Fetch customer tickets
  const { data: ticketsData, isLoading: ticketsLoading } = useQuery({
    queryKey: ['/api/customer/tickets'],
    enabled: !!user?.email,
  });

  const tickets = (ticketsData as any)?.tickets || [];

  // Filter and search tickets
  const filteredTickets = tickets.filter((ticket: any) => {
    const matchesSearch = !searchTerm || 
      ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.number?.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || ticket.state === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const openTicketDetail = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowDetail(true);
  };

  if (ticketsLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Search and Filter Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tickets by title or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {(searchTerm || statusFilter !== "all" || priorityFilter !== "all") && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredTickets.length} of {tickets.length} tickets
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setPriorityFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg mb-2">
            {tickets.length === 0 ? "No tickets yet" : "No tickets match your search"}
          </p>
          <p className="text-sm">
            {tickets.length === 0 
              ? "Create your first support ticket using the 'New Ticket' button above."
              : "Try adjusting your search criteria or filters."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket: any, index: number) => (
            <div
              key={ticket.id || index}
              className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer"
              onClick={() => openTicketDetail(ticket)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900">
                      #{ticket.number || ticket.id}
                    </span>
                    <Badge className={getPriorityColor(ticket.priority || 'medium')}>
                      {(ticket.priority || 'medium').charAt(0).toUpperCase() + (ticket.priority || 'medium').slice(1)}
                    </Badge>
                    <Badge className={getStatusColor(ticket.state || 'open')}>
                      {formatStatus(ticket.state || 'open')}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 hover:text-orange-600">
                    {ticket.title || 'Untitled Ticket'}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Created: {ticket.created_at ? formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true }) : 'Unknown'}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Updated: {ticket.updated_at ? formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: true }) : 'Unknown'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`http://zammad.star.ca:8080/customer_ticket_zoom/${ticket.id}`, '_blank');
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket Detail Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        isOpen={showDetail}
        onClose={() => {
          setShowDetail(false);
          setSelectedTicket(null);
        }}
      />
    </>
  );
}

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch ticket statistics
  const { data: ticketStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/customer/ticket-stats'],
    enabled: !!user?.email,
  });

  // Form for creating new tickets
  const form = useForm<CreateTicketData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      subject: "",
      description: "",
      priority: "medium",
    },
  });

  // Mutation for creating tickets
  const createTicketMutation = useMutation({
    mutationFn: async (data: CreateTicketData) => {
      const response = await fetch('/api/customer/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create ticket');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Ticket Created",
        description: "Your support ticket has been created successfully.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/customer/tickets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/customer/ticket-stats'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const onSubmit = (data: CreateTicketData) => {
    createTicketMutation.mutate(data);
  };

  const stats = (ticketStats as any)?.stats || { total: 0, open: 0, pending: 0, resolved: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-orange-500 to-purple-600 rounded flex items-center justify-center mr-3">
                <Star className="h-5 w-5 text-white fill-current" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
                STAR Solutions
              </span>
              <span className="ml-3 text-sm text-gray-500">Customer Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome back, {user?.fullName || user?.username}
              </span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* New Ticket Button */}
        <div className="flex justify-center mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white px-8 py-3"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Support Ticket</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief description of your issue" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please provide detailed information about your issue"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button type="submit" disabled={createTicketMutation.isPending}>
                      {createTicketMutation.isPending && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      Create Ticket
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Ticket Overview */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Ticket Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="text-center">
                    <Skeleton className="h-12 w-12 mx-auto mb-2 rounded-full" />
                    <Skeleton className="h-8 w-16 mx-auto mb-1" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.open}</div>
                  <div className="text-sm text-gray-500">Open</div>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
                  <div className="text-sm text-gray-500">Pending</div>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.resolved}</div>
                  <div className="text-sm text-gray-500">Resolved</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Support Tickets */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-6 w-6 mr-2" />
                Support Tickets
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('http://zammad.star.ca:8080/customer_ticket_overview', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Full Zammad
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedTicketsList />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}