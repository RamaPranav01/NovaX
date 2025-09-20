"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

// Mock data for policies
const mockPolicies = [
  {
    id: "policy_001",
    name: "Medical Advice Prevention",
    description: "Prevents AI from providing medical diagnoses or treatment recommendations",
    rules: [
      "Block requests for medical diagnoses",
      "Block treatment recommendations", 
      "Block medication advice",
      "Allow general health information"
    ],
    enabled: true,
    created_at: "2024-01-10",
    updated_at: "2024-01-15"
  },
  {
    id: "policy_002",
    name: "Personal Information Protection",
    description: "Protects against PII leaks and unauthorized data access",
    rules: [
      "Block requests for passwords",
      "Block credit card information",
      "Block SSN requests",
      "Block personal addresses"
    ],
    enabled: true,
    created_at: "2024-01-10",
    updated_at: "2024-01-12"
  },
  {
    id: "policy_003",
    name: "Harmful Content Filter",
    description: "Prevents generation of harmful or malicious content",
    rules: [
      "Block hacking instructions",
      "Block violence promotion",
      "Block illegal activities",
      "Flag suspicious requests"
    ],
    enabled: false,
    created_at: "2024-01-08",
    updated_at: "2024-01-08"
  }
];

export default function PoliciesPage() {
  const [policies, setPolicies] = useState(mockPolicies);
  const [editingPolicy, setEditingPolicy] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    rules: [""]
  });
  const [newPolicy, setNewPolicy] = useState({
    name: "",
    description: "",
    rules: [""]
  });
  const [showNewPolicyForm, setShowNewPolicyForm] = useState(false);

  const togglePolicyStatus = (policyId: string) => {
    setPolicies(policies.map(policy => 
      policy.id === policyId 
        ? { ...policy, enabled: !policy.enabled }
        : policy
    ));
  };

  const deletePolicy = (policyId: string) => {
    setPolicies(policies.filter(policy => policy.id !== policyId));
  };

  const addNewRule = () => {
    setNewPolicy({
      ...newPolicy,
      rules: [...newPolicy.rules, ""]
    });
  };

  const updateRule = (index: number, value: string) => {
    const updatedRules = [...newPolicy.rules];
    updatedRules[index] = value;
    setNewPolicy({
      ...newPolicy,
      rules: updatedRules
    });
  };

  const removeRule = (index: number) => {
    setNewPolicy({
      ...newPolicy,
      rules: newPolicy.rules.filter((_, i) => i !== index)
    });
  };

  const saveNewPolicy = () => {
    const policy = {
      id: `policy_${Date.now()}`,
      ...newPolicy,
      rules: newPolicy.rules.filter(rule => rule.trim() !== ""),
      enabled: true,
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    };
    
    setPolicies([...policies, policy]);
    setNewPolicy({ name: "", description: "", rules: [""] });
    setShowNewPolicyForm(false);
  };

  const startEditPolicy = (policyId: string) => {
    const policy = policies.find(p => p.id === policyId);
    if (policy) {
      setEditForm({
        name: policy.name,
        description: policy.description,
        rules: [...policy.rules]
      });
      setEditingPolicy(policyId);
    }
  };

  const cancelEdit = () => {
    setEditingPolicy(null);
    setEditForm({ name: "", description: "", rules: [""] });
  };

  const saveEditPolicy = () => {
    setPolicies(policies.map(policy => 
      policy.id === editingPolicy 
        ? { 
            ...policy, 
            name: editForm.name,
            description: editForm.description,
            rules: editForm.rules.filter(rule => rule.trim() !== ""),
            updated_at: new Date().toISOString().split('T')[0]
          }
        : policy
    ));
    setEditingPolicy(null);
    setEditForm({ name: "", description: "", rules: [""] });
  };

  const addEditRule = () => {
    setEditForm({
      ...editForm,
      rules: [...editForm.rules, ""]
    });
  };

  const updateEditRule = (index: number, value: string) => {
    const updatedRules = [...editForm.rules];
    updatedRules[index] = value;
    setEditForm({
      ...editForm,
      rules: updatedRules
    });
  };

  const removeEditRule = (index: number) => {
    setEditForm({
      ...editForm,
      rules: editForm.rules.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Security Policies
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Configure and manage AI safety and trust policies
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            onClick={() => setShowNewPolicyForm(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Policy
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policies.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {policies.filter(p => p.enabled).length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-yellow-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Policies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {policies.filter(p => !p.enabled).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Policy Form */}
      {showNewPolicyForm && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Create New Policy</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowNewPolicyForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Policy Name</label>
              <Input
                value={newPolicy.name}
                onChange={(e) => setNewPolicy({...newPolicy, name: e.target.value})}
                placeholder="Enter policy name..."
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={newPolicy.description}
                onChange={(e) => setNewPolicy({...newPolicy, description: e.target.value})}
                placeholder="Describe what this policy does..."
                rows={3}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Rules</label>
              <div className="space-y-2">
                {newPolicy.rules.map((rule, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={rule}
                      onChange={(e) => updateRule(index, e.target.value)}
                      placeholder="Enter rule..."
                      className="flex-1"
                    />
                    {newPolicy.rules.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRule(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addNewRule}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowNewPolicyForm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={saveNewPolicy}
                disabled={!newPolicy.name || !newPolicy.description}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Policy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Policies List */}
      <div className="space-y-4">
        {policies.map((policy) => (
          <Card key={policy.id} className="border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CardTitle className="text-lg">{policy.name}</CardTitle>
                  <Badge 
                    variant={policy.enabled ? "default" : "secondary"}
                    className={policy.enabled ? "bg-green-500 text-white" : ""}
                  >
                    {policy.enabled ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePolicyStatus(policy.id)}
                    className={policy.enabled ? "text-yellow-500 hover:text-yellow-600" : "text-green-500 hover:text-green-600"}
                  >
                    {policy.enabled ? "Disable" : "Enable"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEditPolicy(policy.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePolicy(policy.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>{policy.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {editingPolicy === policy.id ? (
                // Edit Form
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Policy Name</label>
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      placeholder="Enter policy name..."
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      placeholder="Describe what this policy does..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rules</label>
                    <div className="space-y-2">
                      {editForm.rules.map((rule, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={rule}
                            onChange={(e) => updateEditRule(index, e.target.value)}
                            placeholder="Enter rule..."
                            className="flex-1"
                          />
                          {editForm.rules.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEditRule(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addEditRule}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Rule
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={saveEditPolicy}
                      disabled={!editForm.name || !editForm.description}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Rules:</h4>
                    <div className="space-y-1">
                      {policy.rules.map((rule, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span>{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>Created: {policy.created_at}</span>
                    <span>Updated: {policy.updated_at}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}