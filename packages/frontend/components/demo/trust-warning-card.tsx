"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

interface TrustWarningCardProps {
  verdict: "SUPPORTED" | "CONTRADICTED" | "UNVERIFIED";
  confidence?: number;
  sources?: string[];
  reasoning?: string;
  className?: string;
}

export function TrustWarningCard({ 
  verdict, 
  confidence = 0, 
  sources = [], 
  reasoning,
  className = "" 
}: TrustWarningCardProps) {
  const getVerdictConfig = (verdict: string) => {
    switch (verdict) {
      case "SUPPORTED":
        return {
          icon: CheckCircle,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/20",
          badgeVariant: "default" as const,
          title: "Information Verified",
          description: "This content has been verified against reliable sources"
        };
      case "CONTRADICTED":
        return {
          icon: XCircle,
          color: "text-red-500",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/20",
          badgeVariant: "destructive" as const,
          title: "Misinformation Detected",
          description: "This content contradicts verified information"
        };
      case "UNVERIFIED":
        return {
          icon: AlertCircle,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/20",
          badgeVariant: "secondary" as const,
          title: "Unverified Content",
          description: "Unable to verify this information against known sources"
        };
      default:
        return {
          icon: Info,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/20",
          badgeVariant: "outline" as const,
          title: "Processing",
          description: "Analyzing content for verification"
        };
    }
  };

  const config = getVerdictConfig(verdict);
  const IconComponent = config.icon;

  return (
    <Card className={`${config.borderColor} ${config.bgColor} ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
            <IconComponent className={`h-5 w-5 ${config.color}`} />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-foreground">{config.title}</h4>
              <Badge variant={config.badgeVariant} className="text-xs">
                {verdict}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {config.description}
            </p>
            
            {confidence > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">Confidence:</span>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      confidence >= 80 ? 'bg-green-500' : 
                      confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${confidence}%` }}
                  />
                </div>
                <span className="text-xs font-medium">{confidence}%</span>
              </div>
            )}
            
            {reasoning && (
              <div className="mt-2 p-2 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Analysis:</strong> {reasoning}
                </p>
              </div>
            )}
            
            {sources.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">Sources:</p>
                <div className="flex flex-wrap gap-1">
                  {sources.slice(0, 3).map((source, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {source}
                    </Badge>
                  ))}
                  {sources.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{sources.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}