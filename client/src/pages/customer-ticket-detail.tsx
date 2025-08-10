import { useParams, useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Clock,
  User,
  MessageSquare,
  Tag,
  Calendar,
  Star,
  LogOut
} from "lucide-react";

export default function CustomerTicketDetail() {
  const { user, logout } = useAuth();
  const params = useParams();
  const ticketId = params.ticketId;
  const [, setLocation] = useLocation();

  // Fetch ticket details
  const { data: ticketData, isLoading, error } = useQuery({
    queryKey: ['/api/customer/tickets', ticketId],
    enabled: !!ticketId && !!user?.email,
  });

  const ticket = (ticketData as any)?.ticket;
  const articles = (ticketData as any)?.articles || [];

  const getStatusColor = (stateId: number) => {
    switch (stateId) {
      case 1: return "bg-blue-100 text-blue-800 border-blue-200";
      case 2: return "bg-green-100 text-green-800 border-green-200";
      case 3: return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 4: return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (stateId: number) => {
    switch (stateId) {
      case 1: return "New";
      case 2: return "Open";
      case 3: return "Pending";
      case 4: return "Closed";
      default: return "Unknown";
    }
  };

  const getPriorityColor = (priorityId: number) => {
    switch (priorityId) {
      case 1: return "bg-green-100 text-green-800";
      case 2: return "bg-blue-100 text-blue-800";
      case 3: return "bg-orange-100 text-orange-800";
      case 4: return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityText = (priorityId: number) => {
    switch (priorityId) {
      case 1: return "Low";
      case 2: return "Normal";
      case 3: return "High";
      case 4: return "Very High";
      default: return "Normal";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <Star className="w-8 h-8 text-white" />
                <span className="text-white font-bold text-xl">STAR Solutions</span>
                <span className="text-white/80 text-sm">Customer Portal</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-white">Welcome back, {user?.username}</span>
                <Button variant="ghost" onClick={() => logout()} className="text-white hover:bg-white/10">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="max-w-4xl mx-auto p-8">
          <Skeleton className="w-32 h-10 mb-6" />
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6">
            <Skeleton className="w-3/4 h-8 mb-4" />
            <div className="flex space-x-4 mb-6">
              <Skeleton className="w-20 h-6" />
              <Skeleton className="w-20 h-6" />
              <Skeleton className="w-32 h-6" />
            </div>
            <Skeleton className="w-full h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">Failed to load ticket details</p>
            <Button onClick={() => setLocation('/customer-dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Star className="w-8 h-8 text-white" />
              <span className="text-white font-bold text-xl">STAR Solutions</span>
              <span className="text-white/80 text-sm">Customer Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white">Welcome back, {user?.username}</span>
              <Button variant="ghost" onClick={() => logout()} className="text-white hover:bg-white/10">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setLocation('/customer-dashboard')}
          className="text-white hover:bg-white/10 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Ticket Header */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl text-gray-900">
                  #{ticket.number} - {ticket.title}
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Created {formatDistanceToNow(new Date(ticket.created_at))} ago
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <Badge className={getStatusColor(ticket.state_id)}>
                  {getStatusText(ticket.state_id)}
                </Badge>
                <Badge className={getPriorityColor(ticket.priority_id)}>
                  {getPriorityText(ticket.priority_id)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                <span>Updated: {formatDistanceToNow(new Date(ticket.updated_at))} ago</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-gray-500" />
                <span>{ticket.article_count || 0} messages</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ticket Articles */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Conversation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {articles.length > 0 ? (
              <div className="space-y-4">
                {articles.map((article: any, index: number) => (
                  <div key={article.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">
                          {article.sender_id === 1 ? 'Support Agent' : 'You'}
                        </span>
                        <Badge variant={article.internal ? "secondary" : "outline"}>
                          {article.internal ? 'Internal' : 'Public'}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(article.created_at))} ago
                      </span>
                    </div>
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: article.body || article.subject }}
                    />
                    {index < articles.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No conversation history available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
