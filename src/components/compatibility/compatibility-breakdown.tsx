import React from 'react';
import { CompatibilityResult, CompatibilityDimension } from '@/types/compatibility';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react';

interface CompatibilityBreakdownProps {
  result: CompatibilityResult;
  className?: string;
}

export function CompatibilityBreakdown({ result, className = '' }: CompatibilityBreakdownProps) {
  // Sort dimensions by weight (most important first)
  const sortedDimensions = [...result.dimensions].sort((a, b) => b.weight - a.weight);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-emerald-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-red-500';
  };
  
  const getScoreIcon = (score: number) => {
    if (score >= 70) return <ArrowUpIcon className="h-4 w-4 text-green-600" />;
    if (score <= 30) return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
    return <MinusIcon className="h-4 w-4 text-amber-500" />;
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-emerald-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Compatibility Analysis</CardTitle>
            <CardDescription>Detailed breakdown of your match</CardDescription>
          </div>
          <Badge className="text-lg px-3 py-1" variant="outline">
            <span className={getScoreColor(result.overallScore)}>{result.overallScore}%</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary match reason */}
        <div className="bg-muted/50 p-3 rounded-md">
          <p className="font-medium text-sm">{result.primaryMatchReason}</p>
        </div>
        
        {/* Dimensions breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Compatibility Factors</h3>
          
          {sortedDimensions.map((dimension, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getScoreIcon(dimension.score)}
                  <span className="text-sm font-medium">{dimension.name}</span>
                </div>
                <span className={`text-sm font-medium ${getScoreColor(dimension.score)}`}>
                  {dimension.score}%
                </span>
              </div>
              <Progress 
                value={dimension.score} 
                className={`h-2 ${getProgressColor(dimension.score)}`}
              />
              <p className="text-xs text-muted-foreground">{dimension.description}</p>
            </div>
          ))}
        </div>
        
        {/* Improvement suggestions */}
        {result.improvementSuggestions && result.improvementSuggestions.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Suggestions to Improve Match</h3>
            <ul className="space-y-1">
              {result.improvementSuggestions.map((suggestion, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
