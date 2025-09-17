import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const DatabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    try {
      setConnectionStatus('testing');
      setError(null);
      
      // Test basic connection
      const { data, error } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1);
        
      if (error) {
        throw error;
      }
      
      setConnectionStatus('connected');
    } catch (err: any) {
      setConnectionStatus('error');
      setError(err.message);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Database Connection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Status:</span>
          <Badge 
            variant={
              connectionStatus === 'connected' ? 'default' : 
              connectionStatus === 'error' ? 'destructive' : 'secondary'
            }
          >
            {connectionStatus === 'testing' && 'Testing...'}
            {connectionStatus === 'connected' && 'Connected'}
            {connectionStatus === 'error' && 'Error'}
          </Badge>
        </div>
        
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded text-sm">
            {error}
          </div>
        )}
        
        <Button onClick={testConnection} className="w-full">
          Test Connection
        </Button>
      </CardContent>
    </Card>
  );
};