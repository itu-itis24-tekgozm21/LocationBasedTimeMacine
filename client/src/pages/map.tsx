import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LocationMap } from '@/components/maps/LocationMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HistoricalSite } from '@shared/schema';
import { getQueryFn } from '@/lib/queryClient';

export default function MapPage() {
  // Fetch historical sites
  const { data: sites = [], isLoading, error } = useQuery<HistoricalSite[]>({
    queryKey: ['/api/sites'],
    queryFn: getQueryFn<HistoricalSite[]>({ on401: 'returnNull' }),
  });

  // Function to format distance
  const formatDistance = (distance: number | null): string => {
    if (distance === null) return 'Distance unavailable';
    if (distance > 1000) return `${(distance / 1000).toFixed(1)} thousand km`;
    return `${distance.toFixed(1)} km`;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Explore Historical Sites</h1>
      
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Interactive Map</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-[500px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-destructive p-4 text-center">
                Error loading map: {error.toString()}
              </div>
            ) : (
              <LocationMap sites={sites} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Distance Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              This map shows your current location and calculates the distance to each historical site.
            </p>
            <p className="mb-2 text-sm text-muted-foreground">
              Allow location access for accurate distance calculations.
            </p>
          </CardContent>
        </Card>

        {sites.map((site: HistoricalSite) => (
          <Card key={site.id} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold">{site.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-muted-foreground">{site.location}</p>
              <p className="mb-4 text-sm">{site.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="font-semibold">Period:</span>
                <span>{site.period}</span>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="font-semibold">Year Built:</span>
                <span>{site.yearBuilt || 'Unknown'}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
