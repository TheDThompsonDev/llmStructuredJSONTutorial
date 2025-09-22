'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Route, 
  Brain, 
  MessageSquare, 
  Users, 
  Target, 
  Activity, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Eye,
  Filter,
  Search,
  Settings,
  BarChart3,
  PieChart,
  Zap,
  ThumbsUp,
  ThumbsDown,
  Star,
  Award,
  Shield,
  Phone,
  Mail,
  Globe,
  Building,
  Briefcase,
  Code,
  DollarSign,
  RefreshCw,
  Download,
  Bell,
  AlertCircle,
  Cpu,
  Database,
  Network
} from 'lucide-react';
import Link from 'next/link';

interface Department {
  id: string;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  description: string;
  agents: number;
  activeAgents: number;
  queueSize: number;
  avgResponseTime: number;
  satisfaction: number;
  efficiency: number;
  specialties: string[];
  todayStats: {
    messagesReceived: number;
    messagesResolved: number;
    avgResolutionTime: number;
    satisfactionScore: number;
  };
  realTimeMetrics: {
    incomingRate: number;
    processingRate: number;
    waitTime: number;
    escalationRate: number;
  };
}

interface RoutedMessage {
  id: string;
  content: string;
  timestamp: Date;
  sentiment: 'positive' | 'neutral' | 'negative';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  confidence: number;
  department: string;
  routing: {
    stage: 'analyzing' | 'classifying' | 'routing' | 'assigned' | 'completed';
    reasoning: string;
    alternativeDepartments: { name: string; confidence: number }[];
    processingTime: number;
  };
  customerProfile: {
    type: 'new' | 'existing' | 'premium' | 'enterprise';
    previousInteractions: number;
    satisfaction: number;
  };
}

interface RoutingFlowNode {
  id: string;
  type: 'input' | 'processing' | 'decision' | 'output';
  label: string;
  position: { x: number; y: number };
  connections: string[];
  active: boolean;
  metrics?: {
    throughput: number;
    accuracy: number;
    latency: number;
  };
}

const departmentConfig = {
  'technical': {
    icon: Code,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20'
  },
  'billing': {
    icon: DollarSign,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20'
  },
  'sales': {
    icon: Briefcase,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20'
  },
  'general': {
    icon: Users,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20'
  },
  'enterprise': {
    icon: Building,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20'
  }
};

const routingFlowNodes: RoutingFlowNode[] = [
  {
    id: 'input',
    type: 'input',
    label: 'Message Input',
    position: { x: 50, y: 200 },
    connections: ['preprocess'],
    active: true,
    metrics: { throughput: 24.6, accuracy: 100, latency: 50 }
  },
  {
    id: 'preprocess',
    type: 'processing',
    label: 'Text Preprocessing',
    position: { x: 200, y: 200 },
    connections: ['sentiment', 'intent'],
    active: true,
    metrics: { throughput: 24.5, accuracy: 99.8, latency: 120 }
  },
  {
    id: 'sentiment',
    type: 'processing',
    label: 'Sentiment Analysis',
    position: { x: 350, y: 120 },
    connections: ['classifier'],
    active: true,
    metrics: { throughput: 24.4, accuracy: 94.2, latency: 180 }
  },
  {
    id: 'intent',
    type: 'processing',
    label: 'Intent Classification',
    position: { x: 350, y: 280 },
    connections: ['classifier'],
    active: true,
    metrics: { throughput: 24.3, accuracy: 91.8, latency: 220 }
  },
  {
    id: 'classifier',
    type: 'decision',
    label: 'AI Router',
    position: { x: 500, y: 200 },
    connections: ['technical', 'billing', 'sales', 'general', 'enterprise'],
    active: true,
    metrics: { throughput: 24.1, accuracy: 89.6, latency: 350 }
  },
  {
    id: 'technical',
    type: 'output',
    label: 'Technical Support',
    position: { x: 700, y: 80 },
    connections: [],
    active: true
  },
  {
    id: 'billing',
    type: 'output',
    label: 'Billing Support',
    position: { x: 700, y: 140 },
    connections: [],
    active: true
  },
  {
    id: 'sales',
    type: 'output',
    label: 'Sales Team',
    position: { x: 700, y: 200 },
    connections: [],
    active: true
  },
  {
    id: 'general',
    type: 'output',
    label: 'General Support',
    position: { x: 700, y: 260 },
    connections: [],
    active: true
  },
  {
    id: 'enterprise',
    type: 'output',
    label: 'Enterprise Support',
    position: { x: 700, y: 320 },
    connections: [],
    active: true
  }
];

export default function MessageRoutingCenter() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [messages, setMessages] = useState<RoutedMessage[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [routingStats, setRoutingStats] = useState({
    totalProcessed: 0,
    accuracy: 0,
    avgRoutingTime: 0,
    satisfactionScore: 0,
    uptime: 0,
    errorRate: 0
  });
  const [activeFlow, setActiveFlow] = useState<string[]>([]);
  const [showFlowDetails, setShowFlowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const svgRef = useRef<SVGSVGElement>(null);

  const fetchRoutingData = async () => {
    try {
      const response = await fetch('/api/routing?type=overview');
      const data = await response.json();
      
      if (data.success) {
        const mappedDepartments = data.data.departments.map((dept: any) => ({
          ...dept,
          icon: departmentConfig[dept.id as keyof typeof departmentConfig]?.icon || Users,
          color: departmentConfig[dept.id as keyof typeof departmentConfig]?.color || 'text-gray-400',
          bgColor: departmentConfig[dept.id as keyof typeof departmentConfig]?.bgColor || 'bg-gray-500/20'
        }));
        
        setDepartments(mappedDepartments);
        setMessages(data.data.recentMessages);
        setRoutingStats(data.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch routing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewMessages = async () => {
    try {
      const response = await fetch('/api/routing?type=messages&limit=5');
      const data = await response.json();
      
      if (data.success && data.messages.length > 0) {
        const newMessage = data.messages[0];
        
        setMessages(prev => [newMessage, ...prev.slice(0, 19)]);
        
        setActiveFlow(['input', 'preprocess', 'sentiment', 'intent', 'classifier', newMessage.department]);
        setActiveFlow([]);

        const statsResponse = await fetch('/api/routing?type=stats');
        const statsData = await statsResponse.json();
        if (statsData.success) {
          setRoutingStats(statsData.stats);
        }
      }
    } catch (error) {
      console.error('Failed to fetch new messages:', error);
    }
  };

  useEffect(() => {
    fetchRoutingData();
    
    const interval = setInterval(fetchNewMessages, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const getDepartmentById = (id: string) => departments.find(d => d.id === id);
  
  const filteredMessages = selectedDepartment === 'all'
    ? messages
    : messages.filter(m => m.department === selectedDepartment);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 via-sky-50 to-sage-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sage-700 mx-auto mb-4"></div>
          <p className="text-sage-700 text-lg">Loading routing data...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 via-sky-50 to-sage-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sage-700 mx-auto mb-4"></div>
          <p className="text-sage-700 text-lg">Loading routing data...</p>
        </div>
      </div>
    );
  }

  const getNodeColor = (node: RoutingFlowNode) => {
    if (activeFlow.includes(node.id)) {
      return node.type === 'output' ? 'fill-green-400' : 'fill-blue-400';
    }
    return node.active ? 'fill-gray-400' : 'fill-gray-600';
  };

  const getConnectionColor = (from: string, to: string) => {
    const fromActive = activeFlow.includes(from);
    const toActive = activeFlow.includes(to);
    if (fromActive && toActive) return 'stroke-blue-400';
    return 'stroke-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-sky-50 to-sage-50 text-sage-700">
      <nav className="glass-nav border-b border-sage-700/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover-scale">
              <div className="p-2 bg-gradient-to-r from-teal-400 to-sage-700 rounded-xl shadow-glow">
                <Route className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-sage-700">Message Routing Center</h1>
                <p className="text-sm text-slate-300">AI-Powered Intelligent Department Routing</p>
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-slate-300 hover:text-sage-700 transition-colors nav-link">
                Dashboard
              </Link>
              <Link href="/batch" className="text-slate-300 hover:text-sage-700 transition-colors nav-link">
                Batch Processing
              </Link>
              <button
                onClick={() => setShowFlowDetails(!showFlowDetails)}
                className="button-primary flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {showFlowDetails ? 'Hide' : 'Show'} Flow Details
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-purple-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="w-8 h-8 text-purple-400" />
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{routingStats.totalProcessed}</div>
            <div className="text-purple-400 text-sm">Messages Routed Today</div>
            <div className="text-xs text-gray-400 mt-1">+{Math.floor(Math.random() * 20 + 10)} in last hour</div>
          </div>

          <div className="bg-blue-500/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-blue-400" />
              <Award className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{routingStats.accuracy.toFixed(1)}%</div>
            <div className="text-blue-400 text-sm">Routing Accuracy</div>
            <div className="text-xs text-gray-400 mt-1">Above industry avg</div>
          </div>

          <div className="bg-green-500/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-8 h-8 text-green-400" />
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{routingStats.avgRoutingTime.toFixed(1)}s</div>
            <div className="text-green-400 text-sm">Avg Routing Time</div>
            <div className="text-xs text-gray-400 mt-1">50% faster than manual</div>
          </div>

          <div className="bg-orange-500/20 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 text-orange-400" />
              <ThumbsUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{routingStats.satisfactionScore}</div>
            <div className="text-orange-400 text-sm">Customer Satisfaction</div>
            <div className="text-xs text-gray-400 mt-1">↑ 0.2 vs last week</div>
          </div>
        </div>

        <div className="grid xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Network className="w-6 h-6 text-purple-400" />
                  AI Routing Flow
                </h2>
                
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${activeFlow.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                  <span className="text-sm text-gray-400">
                    {activeFlow.length > 0 ? 'Processing Message' : 'Idle'}
                  </span>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-6 overflow-x-auto">
                <svg ref={svgRef} width="800" height="400" className="min-w-full">
                  {routingFlowNodes.map(node =>
                    node.connections.map(connectionId => {
                      const targetNode = routingFlowNodes.find(n => n.id === connectionId);
                      if (!targetNode) return null;
                      
                      return (
                        <line
                          key={`${node.id}-${connectionId}`}
                          x1={node.position.x + 50}
                          y1={node.position.y + 25}
                          x2={targetNode.position.x}
                          y2={targetNode.position.y + 25}
                          stroke={getConnectionColor(node.id, connectionId)}
                          strokeWidth="2"
                          className="transition-colors duration-300"
                        />
                      );
                    })
                  )}

                  {routingFlowNodes.map(node => {
                    const isActive = activeFlow.includes(node.id);
                    return (
                      <g key={node.id}>
                        <rect
                          x={node.position.x}
                          y={node.position.y}
                          width="100"
                          height="50"
                          rx="8"
                          className={`${getNodeColor(node)} transition-colors duration-300 ${
                            isActive ? 'animate-pulse' : ''
                          }`}
                          stroke={isActive ? '#60a5fa' : '#4b5563'}
                          strokeWidth="2"
                        />
                        <text
                          x={node.position.x + 50}
                          y={node.position.y + 25}
                          textAnchor="middle"
                          className="fill-white text-xs font-semibold"
                          dominantBaseline="middle"
                        >
                          {node.label}
                        </text>
                        
                        {showFlowDetails && node.metrics && (
                          <g>
                            <rect
                              x={node.position.x - 10}
                              y={node.position.y - 45}
                              width="120"
                              height="35"
                              rx="4"
                              className="fill-gray-800/90"
                              stroke="#374151"
                              strokeWidth="1"
                            />
                            <text x={node.position.x + 50} y={node.position.y - 30} textAnchor="middle" className="fill-green-400 text-xs">
                              {node.metrics.throughput.toFixed(1)}/s • {node.metrics.accuracy.toFixed(1)}%
                            </text>
                            <text x={node.position.x + 50} y={node.position.y - 18} textAnchor="middle" className="fill-gray-400 text-xs">
                              {node.metrics.latency}ms latency
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Activity className="w-6 h-6 text-green-400" />
                  Live Routing Stream
                </h2>
                
                <select 
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {filteredMessages.map((message) => {
                    const department = getDepartmentById(message.department);
                    if (!department) return null;

                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="bg-black/20 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${department.bgColor}`}>
                              <department.icon className={`w-5 h-5 ${department.color}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{department.name}</span>
                                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  message.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                                  message.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                  message.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-green-500/20 text-green-400'
                                }`}>
                                  {message.priority}
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  message.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                                  message.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                                  'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {message.sentiment}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(message.timestamp).toLocaleTimeString()} • {message.routing.processingTime}ms
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm font-bold text-blue-400">
                              {Math.round(message.confidence * 100)}%
                            </div>
                            <div className="text-xs text-gray-400">confidence</div>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                          {message.content}
                        </p>
                        
                        <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
                          <div className="text-xs text-gray-400 mb-1">AI Reasoning:</div>
                          <div className="text-sm text-gray-300">{message.routing.reasoning}</div>
                        </div>

                        {message.routing.alternativeDepartments.length > 0 && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-400">Alternatives:</span>
                            {message.routing.alternativeDepartments.map((alt, index) => (
                              <span key={index} className="bg-gray-700 px-2 py-1 rounded-full">
                                {alt.name} ({Math.round(alt.confidence * 100)}%)
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                {filteredMessages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No messages for selected department</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-sage-700">
                <Users className="w-5 h-5 text-sage-700" />
                Department Status
              </h2>
              
              <div className="space-y-4">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className={`p-4 rounded-xl border transition-all cursor-pointer hover-scale ${dept.bgColor} border-sage-700/30 hover:border-sage-700/50`}
                    onClick={() => setSelectedDepartment(dept.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <dept.icon className={`w-5 h-5 ${dept.color}`} />
                        <span className="font-semibold text-sm text-sage-700">{dept.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${
                          dept.queueSize === 0 ? 'bg-teal-400' :
                          dept.queueSize < 10 ? 'bg-sage-700' : 'bg-slate-300'
                        }`}></div>
                        <span className="text-xs text-slate-300">
                          {dept.activeAgents}/{dept.agents} agents
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs text-center">
                      <div>
                        <div className="font-bold text-slate-300">{dept.queueSize}</div>
                        <div className="text-slate-300">Queue</div>
                      </div>
                      <div>
                        <div className="font-bold text-sage-700">{dept.avgResponseTime}h</div>
                        <div className="text-slate-300">Response</div>
                      </div>
                      <div>
                        <div className="font-bold text-teal-400">{dept.satisfaction}</div>
                        <div className="text-slate-300">Rating</div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-300">Efficiency</span>
                        <span className="text-xs font-semibold text-sage-700">{dept.efficiency}%</span>
                      </div>
                      <div className="w-full bg-sage-700/20 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-sage-700 to-teal-400 h-2 rounded-full"
                          style={{ width: `${dept.efficiency}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-sage-700">
                <BarChart3 className="w-5 h-5 text-teal-400" />
                Real-time Metrics
              </h2>
              
              <div className="space-y-4">
                {[
                  { label: 'Total Throughput', value: departments.reduce((acc, d) => acc + d.realTimeMetrics.incomingRate, 0).toFixed(1) + '/min', color: 'text-sage-700' },
                  { label: 'Avg Wait Time', value: (departments.reduce((acc, d) => acc + d.realTimeMetrics.waitTime, 0) / departments.length).toFixed(1) + 'min', color: 'text-slate-300' },
                  { label: 'Processing Rate', value: departments.reduce((acc, d) => acc + d.realTimeMetrics.processingRate, 0).toFixed(1) + '/min', color: 'text-teal-400' },
                  { label: 'Escalation Rate', value: (departments.reduce((acc, d) => acc + d.realTimeMetrics.escalationRate, 0) / departments.length).toFixed(1) + '%', color: 'text-slate-300' }
                ].map((metric, index) => (
                  <div key={index} className="flex justify-between items-center p-3 glass-card-secondary rounded-xl">
                    <span className="text-slate-300">{metric.label}</span>
                    <span className={`font-bold ${metric.color}`}>{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-sage-700">
                <Settings className="w-5 h-5 text-slate-300" />
                Quick Actions
              </h2>
              
              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  className="button-primary flex items-center gap-3 w-full justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5" />
                    <span>Test Routing Demo</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                <button className="button-secondary flex items-center gap-3 w-full">
                  <Download className="w-5 h-5" />
                  <span>Export Analytics</span>
                </button>
                
                <button className="button-secondary flex items-center gap-3 w-full">
                  <Bell className="w-5 h-5" />
                  <span>Configure Alerts</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}